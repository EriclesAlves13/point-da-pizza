(() => {
  const { LOJA, CATEGORIAS, PRODUTOS } = window;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catDe = (p) => CATEGORIAS.find((c) => c.id === p.cat);
  const ehPizza = (p) => p.cat === "pizzas";
  const variantesDe = (p) => p.variantes || catDe(p).variantes || null;

  // Grupos de opção normalizados: itens sempre como { nome, preco, desc }
  const grupos = (p) => (p.escolhas || []).map((g) => {
    const max = g.max || 1;
    return {
      nome: g.nome, max, modo: g.modo || "soma",
      min: g.min !== undefined ? g.min : (max === 1 ? 1 : 0),
      itens: g.itens.map((it) => (typeof it === "string" ? { nome: it, preco: 0 } : { preco: 0, ...it })),
    };
  });
  const precoMin = (p) => {
    const v = variantesDe(p);
    if (v) return Math.min(...v.map((x) => x.preco));
    // grupo obrigatório no modo "maior" define o piso (ex.: sabor da pizza)
    const piso = grupos(p).filter((g) => g.min > 0 && g.modo === "maior").reduce((s, g) => s + Math.min(...g.itens.map((i) => i.preco)), 0);
    return (p.preco || 0) + piso;
  };
  const temFaixa = (p) => {
    const v = variantesDe(p);
    if (v) return v.length > 1;
    return grupos(p).some((g) => g.modo === "maior" && new Set(g.itens.map((i) => i.preco)).size > 1);
  };
  const zapLink = (txt) => `https://wa.me/${LOJA.whatsapp}${txt ? "?text=" + encodeURIComponent(txt) : ""}`;

  // ---------- Imagens ----------
  // Ordem: img/<id>.jpg → img/cat-<categoria>.jpg → ilustração vetorial
  function ilustracao(p) {
    if (ehPizza(p)) {
      const [molho, queijo, cob] = ["#b8321a", "#f0b94e", "#a3251a"];
      const pts = [[140,130],[250,120],[290,210],[200,200],[120,230],[230,290],[150,300]];
      return `<svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="190" fill="#c98843"/><circle cx="200" cy="200" r="160" fill="${molho}"/><circle cx="200" cy="200" r="150" fill="${queijo}"/>${pts.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="19" fill="${cob}"/>`).join("")}</svg>`;
    }
    if (p.cat === "bebidas" || p.cat === "sucos")
      return `<svg viewBox="0 0 400 400"><rect x="140" y="70" width="120" height="270" rx="22" fill="#d2401f"/><rect x="140" y="150" width="120" height="90" fill="#f4ead9"/><rect x="160" y="50" width="80" height="30" rx="8" fill="#d9a54a"/></svg>`;
    if (p.cat === "artesanais" || p.cat === "sanduiches")
      return `<svg viewBox="0 0 400 400"><path d="M80 190a120 90 0 0 1 240 0Z" fill="#d48a3a"/><rect x="70" y="190" width="260" height="22" rx="10" fill="#6f9a4a"/><rect x="76" y="212" width="248" height="40" rx="16" fill="#5a2e17"/><rect x="70" y="250" width="260" height="16" rx="8" fill="#f0b94e"/><path d="M84 266h232a20 20 0 0 1-20 40H104a20 20 0 0 1-20-40Z" fill="#d48a3a"/></svg>`;
    return `<svg viewBox="0 0 400 400"><circle cx="200" cy="210" r="170" fill="#f4ead9"/><circle cx="200" cy="210" r="130" fill="#e8dcc6"/><ellipse cx="185" cy="205" rx="85" ry="60" fill="#e0a13f"/><circle cx="240" cy="190" r="26" fill="#b8321a"/><circle cx="160" cy="230" r="18" fill="#6f9a4a"/></svg>`;
  }
  window.nobreImgErro = (img) => {
    if (img.dataset.etapa !== "cat") {
      img.dataset.etapa = "cat";
      img.src = `img/cat-${img.dataset.cat}.jpg`;
      img.insertAdjacentHTML("afterend", `<span class="foto-ilustrativa">Foto ilustrativa</span>`);
      return;
    }
    if (img.nextElementSibling && img.nextElementSibling.classList.contains("foto-ilustrativa")) img.nextElementSibling.remove();
    const ph = document.createElement("div");
    ph.className = "ph";
    ph.innerHTML = ilustracao(PRODUTOS.find((p) => p.id === img.dataset.id));
    img.replaceWith(ph);
  };
  const imagem = (p) => `<img src="img/${p.id}.jpg" alt="${esc(p.nome)}" loading="lazy" data-id="${p.id}" data-cat="${p.cat}" onerror="nobreImgErro(this)">`;

  // ---------- Dados da loja na página ----------
  const arred = Math.round(LOJA.nota);
  const nota = LOJA.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 });
  $("#heroEstrelas").textContent = "★".repeat(arred) + "☆".repeat(5 - arred);
  $("#heroNota").textContent = nota;
  $("#heroAval").textContent = LOJA.avaliacoes;
  $("#numNota").textContent = nota;
  $("#numAval").textContent = LOJA.avaliacoes;
  $("#numSabores").textContent = Math.max(0, ...PRODUTOS.filter(ehPizza).map((p) => (grupos(p)[0] || { itens: [] }).itens.length));
  $("#heroHorario").textContent = LOJA.horario.split("·").pop().trim();
  $("#heroTaxa").textContent = LOJA.taxaEntrega === null ? "Por bairro" : LOJA.taxaEntrega ? brl(LOJA.taxaEntrega) : "Grátis";
  $("#heroCidade").textContent = LOJA.cidade.split("—")[0].trim();
  $("#heroZap").href = zapLink(`Olá! Vim pelo site da ${LOJA.nome} 🍕`);
  if (LOJA.endereco) $("#rodapeEndereco").textContent = LOJA.endereco;
  if (LOJA.mapa) { $("#rodapeMapa").href = LOJA.mapa; $("#rodapeMapa").hidden = false; }
  $("#rodapeZap").href = zapLink();
  $("#rodapeZap").textContent = "WhatsApp " + LOJA.whatsappExibicao;
  $("#rodapeHorario").textContent = LOJA.horario;
  $("#rodapeCidade").textContent = LOJA.cidade;
  if (LOJA.instagram) { $("#insta").href = `https://instagram.com/${LOJA.instagram}`; $("#insta").textContent = `Siga @${LOJA.instagram} no Instagram`; }
  if (LOJA.linktree) { $("#rodapeLinktree").href = LOJA.linktree; $("#rodapeLinktree").hidden = false; }
  $("#ano").textContent = new Date().getFullYear();

  // ---------- Cardápio ----------
  // Abas agrupam as 4 linhas de pizza numa só
  // Combos ficam na vitrine própria; o cardápio lista o resto
  const VITRINE = "combos";
  const ABAS = [{ id: "todos", nome: "Tudo" }];
  for (const c of CATEGORIAS) {
    if (c.id === VITRINE) continue;
    if (c.pizza) { if (!ABAS.some((a) => a.id === "pizzas")) ABAS.push({ id: "pizzas", nome: "Pizzas" }); }
    else ABAS.push({ id: c.id, nome: c.nome });
  }
  const abas = $("#abas");
  abas.innerHTML = ABAS.map((a, i) => `<button class="aba${i ? "" : " ativa"}" data-cat="${a.id}">${a.nome}</button>`).join("");

  const precoHtml = (p) => `${temFaixa(p) ? `<small>a partir de</small>` : ""}${brl(precoMin(p))}`;

  function itemMenu(p) {
    return `<button class="item-menu card" data-id="${p.id}" aria-label="${esc(p.nome)}, ${brl(precoMin(p))}">
      <span class="item-thumb">${imagem(p)}</span>
      <span class="item-info">
        <h4>${p.nome}${p.tag ? ` <em class="item-tag">${p.tag}</em>` : ""}</h4>
        <p>${p.desc || ""}</p>
      </span>
      <span class="item-lado">
        <span class="preco">${precoHtml(p)}</span>
        <span class="mais" aria-hidden="true">+</span>
      </span>
    </button>`;
  }

  function combo(p, i) {
    const [inteiro, centavos] = precoMin(p).toFixed(2).split(".");
    return `<button class="combo card reveal" data-id="${p.id}" aria-label="${esc(p.nome)}, ${brl(precoMin(p))}">
      ${i === 0 ? `<span class="combo-img">${imagem(p)}</span>` : ""}
      <span class="combo-topo">
        <h3>${p.nome}</h3>
        <span class="combo-preco"><small>R$</small>${inteiro}${centavos !== "00" ? `<small>,${centavos}</small>` : ""}</span>
      </span>
      <p>${p.desc || ""}</p>
      <span class="combo-pe">
        ${p.tag ? `<span class="combo-tag">${p.tag}</span>` : "<span></span>"}
        <span class="mais" aria-hidden="true">+</span>
      </span>
    </button>`;
  }
  $("#listaCombos").innerHTML = PRODUTOS.filter((p) => p.cat === VITRINE).map(combo).join("");
  $("#listaCombos").addEventListener("click", (e) => {
    const c = e.target.closest(".card"); if (c) abrirProduto(c.dataset.id);
  });
  $$("[data-abrir]").forEach((b) => b.addEventListener("click", () => abrirProduto(b.dataset.abrir)));
  const oferta = PRODUTOS.find((p) => p.id === ($(".hero-oferta") || {}).dataset?.abrir);
  if (oferta) $("#ofertaPreco").textContent = "R$" + precoMin(oferta).toLocaleString("pt-BR");

  let filtroCat = "todos", termo = "";
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function renderCardapio() {
    const t = norm(termo);
    let total = 0;
    $("#listaCardapio").innerHTML = CATEGORIAS
      .filter((c) => c.id !== VITRINE && (filtroCat === "todos" || c.id === filtroCat || (filtroCat === "pizzas" && c.pizza)))
      .map((c) => {
        const itens = PRODUTOS.filter((p) => p.cat === c.id && (!t || norm(p.nome + " " + (p.desc || "")).includes(t)));
        total += itens.length;
        if (!itens.length) return "";
        const faixa = c.variantes && c.variantes.length > 1 ? c.variantes.map((v) => `${v.sigla} ${brl(v.preco)}`).join(" · ") : `${itens.length} ${itens.length > 1 ? "opções" : "opção"}`;
        return `<section class="categoria reveal" id="cat-${c.id}">
          <div class="categoria-titulo"><h3>${c.nome}</h3><small>${faixa}</small></div>
          <div class="grade">${itens.map(itemMenu).join("")}</div>
        </section>`;
      }).join("");
    $("#semResultado").hidden = total > 0;
    observarReveal();
  }
  abas.addEventListener("click", (e) => {
    const b = e.target.closest(".aba"); if (!b) return;
    $$(".aba").forEach((a) => a.classList.toggle("ativa", a === b));
    filtroCat = b.dataset.cat;
    renderCardapio();
    $("#cardapio").scrollIntoView({ behavior: "smooth" });
  });
  $("#busca").addEventListener("input", (e) => { termo = e.target.value; renderCardapio(); });
  $("#listaCardapio").addEventListener("click", (e) => {
    const c = e.target.closest(".card"); if (c) abrirProduto(c.dataset.id);
  });

  // ---------- Modal de produto ----------
  const modal = $("#modalProduto");
  const op = $("#mpOpcoes");
  let atual = null, qtd = 1;

  const titulo = (txt, nota = "") => `<div class="grupo-titulo"><span>${txt}</span><small>${nota}</small></div>`;
  const regraGrupo = (g) =>
    g.min > 0 && g.max === g.min ? (g.max === 1 ? "obrigatório" : `escolha ${g.max}`)
      : g.min > 0 ? `escolha de ${g.min} a ${g.max}`
      : g.max > 1 ? `opcional · até ${g.max}` : "opcional";

  // Opção com descrição vira lista; sem descrição vira "chip"
  function grupoHtml(g, gi) {
    const unico = g.max === 1 && g.min === 1;
    const tipo = unico ? "radio" : "checkbox";
    const lista = g.itens.some((it) => it.desc);
    const opcoes = g.itens.map((it, i) => {
      const preco = it.preco ? `<small>${g.modo === "soma" ? "+ " : ""}${brl(it.preco)}</small>` : "";
      const marcado = unico && i === 0 ? "checked" : "";
      return lista
        ? `<label><input type="${tipo}" name="esc${gi}" value="${i}" ${marcado}><span><b>${it.nome}</b>${preco}<em>${it.desc || ""}</em></span></label>`
        : `<label><input type="${tipo}" name="esc${gi}" value="${i}" ${marcado}><span>${it.nome}${preco}</span></label>`;
    }).join("");
    return `<div class="grupo" data-grupo="${gi}">${titulo(g.nome, regraGrupo(g))}<fieldset class="opcoes${lista ? " opcoes-lista" : ""}">${opcoes}</fieldset></div>`;
  }

  function abrirProduto(id) {
    atual = PRODUTOS.find((p) => p.id === id);
    qtd = 1;
    const vars = variantesDe(atual);
    let html = "";
    if (vars && vars.length > 1)
      html += `<div>${titulo("Tamanho", "obrigatório")}<fieldset class="opcoes">${vars.map((v, i) =>
        `<label><input type="radio" name="var" value="${i}" ${i === 0 ? "checked" : ""}><span>${v.nome}<small>${brl(v.preco)}</small></span></label>`).join("")}</fieldset></div>`;
    html += grupos(atual).map(grupoHtml).join("");
    op.innerHTML = html;
    op.hidden = !html;
    $("#mpImg").innerHTML = imagem(atual);
    $("#mpNome").textContent = atual.nome;
    $("#mpDesc").textContent = atual.desc || "";
    $("#mpObs").value = "";
    atualizarModal();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function configModal() {
    const vars = variantesDe(atual);
    const varSel = op.querySelector("input[name=var]:checked");
    const v = vars ? vars[varSel ? +varSel.value : 0] : null;
    let preco = v ? v.preco : atual.preco || 0;
    const detalhes = [];
    const faltando = [];
    if (v && vars.length > 1) detalhes.push(v.nome);
    grupos(atual).forEach((g, gi) => {
      const sel = $$(`input[name=esc${gi}]:checked`, op).map((i) => g.itens[+i.value]);
      if (sel.length < g.min) faltando.push(g.nome);
      if (!sel.length) return;
      preco += g.modo === "maior" ? Math.max(...sel.map((s) => s.preco)) : sel.reduce((s, it) => s + it.preco, 0);
      detalhes.push(`${g.nome}: ${sel.map((s) => s.nome).join(" + ")}`);
    });
    return { preco, nome: atual.nome, detalhes, faltando, chave: [atual.id, ...detalhes].join("|") };
  }
  function atualizarModal() {
    // trava as opções extras quando o grupo atinge o máximo
    grupos(atual).forEach((g, gi) => {
      if (g.max === 1 && g.min === 1) return;
      const boxes = $$(`input[name=esc${gi}]`, op);
      const n = boxes.filter((b) => b.checked).length;
      boxes.forEach((b) => (b.disabled = !b.checked && n >= g.max));
    });
    const { preco, faltando } = configModal();
    $("#mpQtd").textContent = qtd;
    $("#mpTotal").textContent = faltando.length ? `escolha ${faltando[0].toLowerCase()}` : brl(preco * qtd);
    $("#mpAdicionar").disabled = faltando.length > 0;
  }
  function fecharModal() { modal.hidden = true; document.body.style.overflow = ""; }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-fechar]")) fecharModal(); });
  op.addEventListener("change", atualizarModal);
  $("#mpMais").onclick = () => { qtd++; atualizarModal(); };
  $("#mpMenos").onclick = () => { qtd = Math.max(1, qtd - 1); atualizarModal(); };
  $("#mpAdicionar").onclick = () => {
    const { preco, nome, detalhes, faltando, chave: base } = configModal();
    if (faltando.length) return;
    const obs = $("#mpObs").value.trim();
    const chave = base + "|" + obs;
    const existente = sacola.find((i) => i.chave === chave);
    if (existente) existente.qtd += qtd;
    else sacola.push({ chave, nome, detalhes, obs, preco, qtd });
    salvar();
    fecharModal();
    toast(`${nome} na sacola`);
  };

  // ---------- Sacola ----------
  let sacola = [];
  try { sacola = (JSON.parse(localStorage.getItem("point-sacola")) || []).filter((i) => Array.isArray(i.detalhes)); } catch { sacola = []; }
  function salvar() {
    try { localStorage.setItem("point-sacola",JSON.stringify(sacola)); } catch {}
    renderSacola();
  }
  const ehEntrega = () => $("input[name=tipo]:checked").value === "entrega";
  const totais = () => {
    const sub = sacola.reduce((s, i) => s + i.preco * i.qtd, 0);
    const entrega = ehEntrega() && sacola.length > 0;
    const aConfirmar = entrega && LOJA.taxaEntrega === null;   // loja cobra por bairro
    const taxa = entrega && !aConfirmar ? LOJA.taxaEntrega : 0;
    return { sub, taxa, aConfirmar, total: sub + taxa, itens: sacola.reduce((s, i) => s + i.qtd, 0) };
  };
  function renderSacola() {
    const { sub, taxa, aConfirmar, total, itens } = totais();
    $("#itensSacola").innerHTML = sacola.map((i, idx) => `<li class="item">
      <h5>${esc(i.nome)}</h5><span class="item-preco">${brl(i.preco * i.qtd)}</span>
      <p>${esc([...i.detalhes, i.obs && "Obs: " + i.obs].filter(Boolean).join(" · ") || brl(i.preco) + " cada")}</p>
      <div class="qtd"><button data-menos="${idx}" aria-label="Diminuir">−</button><b>${i.qtd}</b><button data-mais="${idx}" aria-label="Aumentar">+</button></div>
    </li>`).join("");
    $("#sacolaVazia").hidden = sacola.length > 0;
    $("#formPedido").hidden = !sacola.length;
    $("#resSub").textContent = brl(sub);
    $("#resTaxa").textContent = aConfirmar ? "a confirmar" : taxa ? brl(taxa) : ehEntrega() ? "Grátis" : "Retirada";
    $("#resTotal").textContent = brl(total) + (aConfirmar ? " + entrega" : "");
    $("#finalizar").disabled = !sacola.length;
    for (const el of [$("#contadorTopo"), $("#contadorFlut")]) {
      if (el.textContent !== String(itens)) { el.classList.remove("pulo"); void el.offsetWidth; el.classList.add("pulo"); }
      el.textContent = itens;
    }
    $("#totalFlut").textContent = brl(total);
    $("#sacolaFlutuante").hidden = !itens || window.innerWidth > 900;
  }
  $("#itensSacola").addEventListener("click", (e) => {
    const m = e.target.dataset.mais, n = e.target.dataset.menos;
    if (m !== undefined) sacola[m].qtd++;
    else if (n !== undefined) { sacola[n].qtd--; if (!sacola[n].qtd) sacola.splice(n, 1); }
    else return;
    salvar();
  });

  const gaveta = $("#gaveta");
  const abrirSacola = () => { gaveta.hidden = false; document.body.style.overflow = "hidden"; $("#avisoPedido").hidden = true; };
  const fecharSacola = () => { gaveta.hidden = true; document.body.style.overflow = ""; };
  $("#abrirSacola").onclick = abrirSacola;
  $("#sacolaFlutuante").onclick = abrirSacola;
  gaveta.addEventListener("click", (e) => { if (e.target.closest("[data-fechar-sacola]")) fecharSacola(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { fecharModal(); fecharSacola(); } });

  const form = $("#formPedido");
  form.addEventListener("change", () => {
    $("#camposEntrega").hidden = !ehEntrega();
    $("#campoTroco").hidden = form.pagamento.value !== "Dinheiro";
    $("#notaPix").hidden = form.pagamento.value !== "Pix" || !LOJA.avisoPix;
    renderSacola();
  });
  $("#notaPix").textContent = LOJA.avisoPix || "";
  try { const d = JSON.parse(localStorage.getItem("point-cliente")) || {}; for (const k in d) if (form[k]) form[k].value = d[k]; } catch {}

  // ---------- Finalizar no WhatsApp ----------
  $("#finalizar").onclick = () => {
    const f = Object.fromEntries(new FormData(form));
    const entrega = ehEntrega();
    const obrig = entrega ? ["nome", "endereco", "bairro"] : ["nome"];
    const faltando = obrig.filter((k) => !String(f[k] || "").trim());
    $$(".campo input", form).forEach((i) => i.classList.toggle("erro", faltando.includes(i.name)));
    const { sub, taxa, aConfirmar, total } = totais();
    let aviso = "";
    if (faltando.length) aviso = "Preencha os campos obrigatórios (*).";
    else if (sub < LOJA.pedidoMinimo) aviso = `Pedido mínimo de ${brl(LOJA.pedidoMinimo)}.`;
    if (aviso) {
      $("#avisoPedido").textContent = aviso; $("#avisoPedido").hidden = false;
      if (faltando[0]) form[faltando[0]].focus();
      return;
    }
    try { const { nome, fone, endereco, bairro, complemento, referencia } = f; localStorage.setItem("point-cliente",JSON.stringify({ nome, fone, endereco, bairro, complemento, referencia })); } catch {}

    const linhas = [
      `*Novo pedido · ${LOJA.nome} ${LOJA.subtitulo}*`,
      "",
      ...sacola.map((i) => [
        `*${i.qtd}x ${i.nome}* · ${brl(i.preco * i.qtd)}`,
        ...i.detalhes.map((d) => `   • ${d}`),
        i.obs && `   _Obs: ${i.obs}_`,
      ].filter(Boolean).join("\n")),
      "",
      `Subtotal: ${brl(sub)}`,
      entrega ? `Entrega: ${aConfirmar ? "taxa a confirmar" : brl(taxa)}` : null,
      `*Total: ${brl(total)}*${aConfirmar ? " + taxa de entrega" : ""}`,
      "",
      `*${entrega ? "🛵 Entrega" : "🏃 Retirada no local"}*`,
      `Nome: ${f.nome.trim()}`,
      f.fone ? `Telefone: ${f.fone}` : null,
      entrega ? `Endereço: ${f.endereco}${f.complemento ? ", " + f.complemento : ""}` : null,
      entrega ? `Bairro: ${f.bairro}` : null,
      entrega && f.referencia ? `Referência: ${f.referencia}` : null,
      "",
      `Pagamento: ${f.pagamento}${f.pagamento === "Dinheiro" && f.troco ? ` (troco para R$ ${f.troco})` : ""}${f.pagamento === "Pix" ? " (QR code na maquininha)" : ""}`,
    ].filter((l) => typeof l === "string");
    window.open(zapLink(linhas.join("\n")), "_blank");
  };

  // ---------- Toast ----------
  let tt;
  function toast(t) {
    const el = $("#toast"); el.textContent = t; el.classList.add("mostra");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("mostra"), 2200);
  }

  // ---------- Animações de entrada ----------
  const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" }) : null;
  function observarReveal() {
    $$(".reveal:not(.visivel)").forEach((el, i) => {
      if (!io) return el.classList.add("visivel");
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  }
  window.addEventListener("scroll", () => $("#topo").classList.toggle("rolou", scrollY > 10), { passive: true });
  window.addEventListener("resize", renderSacola);

  renderCardapio();
  renderSacola();
  form.dispatchEvent(new Event("change"));
})();
