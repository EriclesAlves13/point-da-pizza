// =============================================================
//  POINT DA PIZZA — Maranguape/CE
//  Edite este arquivo para trocar dados da loja, preços e cardápio.
//  Cardápio copiado da loja no Anota AI (pedido.anota.ai/loja/point-da-pizza-7).
// =============================================================

window.LOJA = {
  nome: "Point da Pizza",
  subtitulo: "Pizzaria & Lanches",
  whatsapp: "5585921476511",          // NÚMERO DE TESTE. Oficial: 5585988457129
  whatsappExibicao: "(85) 92147-6511",
  instagram: "pointdapizza._",
  nota: 4.5,                           // Google Maps (o Anota AI não exibe nota)
  avaliacoes: 75,
  endereco: "Av. Senador Almir Pinto, 1827 · Novo Maranguape II",
  cidade: "Maranguape — CE",
  mapa: "https://www.google.com/maps/place/Point+da+Pizza/@-3.8794263,-38.6741157,18z",
  horario: "Abre às 17h30",
  taxaEntrega: null,                   // null = taxa confirmada pela loja no WhatsApp
  pedidoMinimo: 0,
  avisoPix: "Pix só por QR code na maquininha do entregador.",
};

// Grupos de opção dos produtos (campo "escolhas"):
//   itens  -> texto, ou { nome, preco, desc }
//   max    -> quantas opções podem ser marcadas (1 = escolha única)
//   min    -> mínimo obrigatório (padrão: 1 se max = 1, senão 0)
//   modo   -> "soma" (preço de cada opção é somado) ou "maior" (vale a mais cara)
// variantes -> opções com preço que substituem o preço base (tamanho, peso…)

const SABORES_PIZZA = [
  { nome: "Calabresa", preco: 25, desc: "Molho, mussarela, calabresa e orégano" },
  { nome: "Mussarela", preco: 25, desc: "Molho, mussarela, tomate e orégano" },
  { nome: "Mista", preco: 25, desc: "Molho, mussarela, presunto e orégano" },
  { nome: "Milho verde", preco: 25, desc: "Molho, mussarela, milho verde e orégano" },
  { nome: "Catupiry", preco: 25, desc: "Molho, mussarela, catupiry e orégano" },
  { nome: "Cheddar", preco: 25, desc: "Molho, mussarela, cheddar e orégano" },
  { nome: "2 queijos", preco: 27, desc: "Molho, mussarela, queijo, cheddar, catupiry e orégano" },
  { nome: "Portuguesa", preco: 27, desc: "Molho, mussarela, presunto, tomate, cebola, pimentão, ovo, milho e orégano" },
  { nome: "Calamista", preco: 27, desc: "Molho, mussarela, milho, cheddar, presunto, calabresa e orégano" },
  { nome: "Frango", preco: 28, desc: "Molho, mussarela, frango, milho e orégano" },
  { nome: "Frango catupiry", preco: 28, desc: "Molho, mussarela, frango, catupiry, milho e orégano" },
  { nome: "Frango cheddar", preco: 28, desc: "Molho, mussarela, frango, cheddar, milho e orégano" },
  { nome: "Bacon", preco: 28, desc: "Molho, mussarela, bacon, pimentão e orégano" },
  { nome: "Carne de sol", preco: 30, desc: "Molho, mussarela, carne do sol, cebola, pimentão e orégano" },
  { nome: "Carne do Sol Catupiry", preco: 30, desc: "Molho, mussarela, carne, catupiry, cebola, pimentão, azeitona e orégano" },
  { nome: "Carne do Sol Bacon", preco: 32, desc: "Molho, mussarela, carne, bacon, cebola, pimentão, azeitona e orégano" },
  { nome: "Master Frango", preco: 32, desc: "Molho, mussarela, frango, bacon, milho, azeitona e orégano" },
  { nome: "Master Frango Barbecue", preco: 32, desc: "Molho, mussarela, frango, bacon, barbecue, milho, azeitona e orégano" },
  { nome: "A moda do Point", preco: 35, desc: "Molho, mussarela, carne do sol, calabresa, bacon, frango, catupiry e orégano" },
  { nome: "Chocolate", preco: 32, desc: "Chocolate, M&M's, morango e leite condensado" },
  { nome: "Chocolate Branco", preco: 32, desc: "Chocolate branco, M&M's e chocopower" },
  { nome: "Duo", preco: 32, desc: "Chocolate e chocolate branco" },
];

const BORDAS = { nome: "Borda", min: 0, max: 1, modo: "soma", itens: [{ nome: "Cheddar", preco: 3 }, { nome: "Chocolate", preco: 5 }] };

const ADICIONAIS_PIZZA = {
  nome: "Adicionais", max: 4, modo: "soma",
  itens: [
    { nome: "Queijo", preco: 5 }, { nome: "Calabresa", preco: 5 }, { nome: "Bacon", preco: 5 },
    { nome: "Carne do sol", preco: 5 }, { nome: "Frango", preco: 5 }, { nome: "Catupiry", preco: 3 },
    { nome: "Cheddar", preco: 3 }, { nome: "Ovo", preco: 3 }, { nome: "Tomate", preco: 2 },
    { nome: "Pimentão", preco: 2 }, { nome: "Cebola", preco: 2 }, { nome: "Milho", preco: 2 },
    { nome: "Azeitona", preco: 0 },
  ],
};

const SABORES_CALZONE = ["Calabresa", "Mussarela", "Mista", "Milho verde", "Calamista", "Bacon", "Frango", "Portuguesa", "Frango Catupiry", "Frango cheddar", "Frango Bacon", "Carne do sol", "Carne Bacon", "Carne Catupiry", "Chocolate", "Chocolate Branco", "Moda da casa"];
const REFRI_PEQUENO = ["Guaraná 200ml", "Pepsi 200ml"];
const REFRI_LITRO = ["Guaraná 1L", "Pepsi 1L"];
const FRUTAS = ["Goiaba", "Maracujá", "Graviola", "Manga", "Cajá", "Abacaxi"];

window.CATEGORIAS = [
  { id: "combos", nome: "Combos" },
  { id: "pizzas", nome: "Pizzas" },
  { id: "calzones", nome: "Calzones" },
  { id: "artesanais", nome: "Sanduíches Artesanais" },
  { id: "sanduiches", nome: "Sanduíches" },
  { id: "pasteis", nome: "Pastéis" },
  { id: "batatas", nome: "Batatas" },
  { id: "gelatto", nome: "Gelatto" },
  { id: "bebidas", nome: "Refrigerantes" },
  { id: "sucos", nome: "Sucos e Vitaminas" },
  { id: "brownies", nome: "Brownies" },
];

window.PRODUTOS = [
  // ---------- Combos ----------
  { id: "combo-familia", cat: "combos", nome: "Combo Família", desc: "4 X-Burguers (pão brioche) + batata recheada + Guaraná ou Pepsi 1 litro.", preco: 45, tag: "Mais pedido",
    escolhas: [{ nome: "Refrigerante", itens: REFRI_LITRO }] },
  { id: "combo-calzone", cat: "combos", nome: "Combo Calzone", desc: "1 calzone, porção de batata e refrigerante de 1L.", preco: 35,
    escolhas: [{ nome: "Sabor do calzone", itens: SABORES_CALZONE }] },
  { id: "combo-casal", cat: "combos", nome: "Combo Casal", desc: "1 X-Bacon, 1 X-Calabresa + batata + Guaraná ou Pepsi 1 litro.", preco: 35,
    escolhas: [{ nome: "Refrigerante", itens: REFRI_LITRO }] },
  { id: "combo-mega-point", cat: "combos", nome: "Mega Point", desc: "Pão árabe, 2 carnes, calabresa, bacon, mussarela da casa, barbecue, molho da casa, tomate, alface + batata recheada.", preco: 35 },
  { id: "combo-x-duplo", cat: "combos", nome: "Combo X-Duplo", desc: "1 X-Duplo + batata + Guaraná ou Pepsi 200ml.", preco: 25,
    escolhas: [{ nome: "Refrigerante", itens: REFRI_PEQUENO }] },
  { id: "combo-individual", cat: "combos", nome: "Combo Individual", desc: "1 X-Burguer + porção pequena de batata + Guaraná ou Pepsi 200ml.", preco: 20,
    escolhas: [{ nome: "Refrigerante", itens: REFRI_PEQUENO }] },

  // ---------- Pizzas ----------
  { id: "pizza-1-sabor", cat: "pizzas", nome: "Pizza Grande · 1 sabor", desc: "Pizza grande com 1 sabor e 8 fatias.", preco: 0, tag: "8 fatias",
    escolhas: [{ nome: "Sabor", max: 1, modo: "maior", itens: SABORES_PIZZA }, BORDAS, ADICIONAIS_PIZZA] },
  { id: "pizza-2-sabores", cat: "pizzas", nome: "Pizza Grande · 2 sabores", desc: "Pizza grande com até 2 sabores e 8 fatias. Vale o preço do sabor mais caro.", preco: 0, tag: "Meio a meio",
    escolhas: [{ nome: "Sabores", min: 1, max: 2, modo: "maior", itens: SABORES_PIZZA }, BORDAS, ADICIONAIS_PIZZA] },

  // ---------- Calzones ----------
  { id: "calzone-calabresa", cat: "calzones", nome: "Calzone Calabresa", preco: 22 },
  { id: "calzone-mussarela", cat: "calzones", nome: "Calzone Mussarela", preco: 22 },
  { id: "calzone-mista", cat: "calzones", nome: "Calzone Mista", preco: 22 },
  { id: "calzone-milho", cat: "calzones", nome: "Calzone Milho verde", preco: 22 },
  { id: "calzone-calamista", cat: "calzones", nome: "Calzone Calamista", preco: 23 },
  { id: "calzone-bacon", cat: "calzones", nome: "Calzone Bacon", preco: 23 },
  { id: "calzone-frango", cat: "calzones", nome: "Calzone Frango", preco: 23 },
  { id: "calzone-portuguesa", cat: "calzones", nome: "Calzone Portuguesa", preco: 23 },
  { id: "calzone-chocolate-branco", cat: "calzones", nome: "Calzone Chocolate Branco", preco: 23 },
  { id: "calzone-frango-catupiry", cat: "calzones", nome: "Calzone Frango Catupiry", preco: 24 },
  { id: "calzone-frango-cheddar", cat: "calzones", nome: "Calzone Frango cheddar", preco: 24 },
  { id: "calzone-frango-bacon", cat: "calzones", nome: "Calzone Frango Bacon", preco: 24 },
  { id: "calzone-carne-bacon", cat: "calzones", nome: "Calzone Carne Bacon", preco: 24 },
  { id: "calzone-carne-catupiry", cat: "calzones", nome: "Calzone Carne Catupiry", preco: 24 },
  { id: "calzone-carne-sol", cat: "calzones", nome: "Calzone Carne do sol", preco: 25 },
  { id: "calzone-chocolate", cat: "calzones", nome: "Calzone Chocolate", preco: 25 },
  { id: "calzone-moda-casa", cat: "calzones", nome: "Calzone Moda da casa", preco: 25 },

  // ---------- Sanduíches Artesanais (não acompanham refri) ----------
  { id: "point-kids", cat: "artesanais", nome: "Point Kids", desc: "Pão artesanal, carne artesanal, queijo cheddar e molhos da casa.", preco: 12 },
  { id: "point-picante", cat: "artesanais", nome: "Point Picante", desc: "Pão artesanal, carne artesanal, queijo cheddar, alface, tomate e molho picante da casa.", preco: 15 },
  { id: "point-onions", cat: "artesanais", nome: "Point Onion's", desc: "Pão artesanal, carne artesanal, queijo cheddar, farofa de calabresa, onion rings, alface, tomate e molhos da casa.", preco: 16 },
  { id: "point-delicia", cat: "artesanais", nome: "Point Delícia", desc: "Pão artesanal, carne artesanal, queijo cheddar, bacon, cebola caramelizada, alface, tomate e molhos da casa.", preco: 16 },
  { id: "point-bagunca", cat: "artesanais", nome: "Point Bagunça", desc: "Pão artesanal, carne artesanal, queijo cheddar, bacon, calabresa, ovo, cebola, alface, tomate e molhos da casa.", preco: 18, tag: "Completão" },

  // ---------- Sanduíches ----------
  { id: "x-burguer", cat: "sanduiches", nome: "X-Burguer", desc: "Pão bola, carne tradicional, mussarela, molho barbecue, alface, tomate e molho da casa.", preco: 10 },
  { id: "x-salada", cat: "sanduiches", nome: "X-Salada", desc: "Pão árabe, carne tradicional, molho da casa, mussarela, milho e salada.", preco: 10 },
  { id: "x-bacon", cat: "sanduiches", nome: "X-Bacon", desc: "Pão árabe, carne tradicional, bacon, molho barbecue, molho da casa, tomate e alface.", preco: 11 },
  { id: "x-calabresa", cat: "sanduiches", nome: "X-Calabresa", desc: "Pão árabe, carne tradicional, calabresa, queijo, molho barbecue, molho da casa, tomate e alface.", preco: 11 },
  { id: "bauru", cat: "sanduiches", nome: "Bauru", desc: "Pão árabe, carne tradicional, ovo, queijo, presunto, salada e molho da casa.", preco: 12 },
  { id: "x-carne-sol", cat: "sanduiches", nome: "X-Carne do Sol", desc: "Pão árabe, carne tradicional, carne do sol, queijo, barbecue, molho da casa, tomate e alface.", preco: 14 },
  { id: "x-frango", cat: "sanduiches", nome: "X-Frango", desc: "Pão árabe, carne tradicional, frango, queijo, molho da casa, tomate, milho e alface.", preco: 14 },
  { id: "x-duplo", cat: "sanduiches", nome: "X-Duplo", desc: "Pão bola, 2 carnes, 2 queijos, bacon, calabresa, molho da casa, barbecue, tomate e alface.", preco: 15, tag: "Favorito" },

  // ---------- Pastéis (massa dupla) ----------
  { id: "pastel-queijo", cat: "pasteis", nome: "Pastel Queijo", desc: "Massa dupla e queijo.", preco: 12 },
  { id: "pastel-misto", cat: "pasteis", nome: "Pastel Misto", desc: "Massa dupla, queijo e presunto.", preco: 12 },
  { id: "pastel-frango", cat: "pasteis", nome: "Pastel Frango", desc: "Massa dupla, frango, queijo e milho verde.", preco: 14 },
  { id: "pastel-carne-moida", cat: "pasteis", nome: "Pastel Carne Moída", desc: "Massa dupla, carne moída, queijo e milho verde.", preco: 14 },
  { id: "pastel-calabresa", cat: "pasteis", nome: "Pastel Calabresa", desc: "Massa dupla, calabresa e queijo.", preco: 14 },
  { id: "pastel-bacon", cat: "pasteis", nome: "Pastel Bacon", desc: "Massa dupla, queijo, bacon e azeitona.", preco: 14 },
  { id: "pastel-carne-sol", cat: "pasteis", nome: "Pastel Carne do Sol", desc: "Massa dupla, carne do sol e queijo.", preco: 16 },
  { id: "pastel-chocolate", cat: "pasteis", nome: "Pastel Chocolate", desc: "Massa dupla e chocolate.", preco: 16 },
  { id: "pastel-moda-point", cat: "pasteis", nome: "Pastel Moda do Point", desc: "Massa dupla, queijo, presunto, carne do sol, frango, ovo e milho.", preco: 20, tag: "Recheadão" },

  // ---------- Batatas ----------
  { id: "batata-tradicional", cat: "batatas", nome: "Batata Tradicional", desc: "Porção de batata frita tradicional (aprox. 350g).", preco: 12 },
  { id: "batata-recheada", cat: "batatas", nome: "Batata Recheada", desc: "Batata frita com calabresa, cheddar e bacon (aprox. 350g).", preco: 15 },

  // ---------- Gelatto (R$ 4 a cada 100g; 1kg sai por R$ 42) ----------
  { id: "gelatto", cat: "gelatto", nome: "Gelatto", desc: "Vendido por peso. O quilo sai por R$ 42,00.",
    variantes: [200, 300, 400, 500, 600, 700, 800, 900].map((g) => ({ nome: `${g}g`, preco: (g / 100) * 4 })).concat([{ nome: "1kg", preco: 42 }]) },

  // ---------- Refrigerantes ----------
  { id: "coca-cola", cat: "bebidas", nome: "Coca-Cola", desc: "Original.",
    variantes: [{ nome: "250ml", preco: 3.5 }, { nome: "Lata 350ml", preco: 5 }, { nome: "1L", preco: 10 }, { nome: "2L", preco: 15 }] },
  { id: "coca-cola-zero", cat: "bebidas", nome: "Coca-Cola Zero", desc: "Sem açúcar.",
    variantes: [{ nome: "Lata 350ml", preco: 5 }, { nome: "1L", preco: 10 }, { nome: "2L", preco: 15 }] },
  { id: "guarana", cat: "bebidas", nome: "Guaraná Antarctica", desc: "",
    variantes: [{ nome: "200ml", preco: 3.5 }, { nome: "Lata 350ml", preco: 5 }, { nome: "1L", preco: 9 }] },
  { id: "pepsi", cat: "bebidas", nome: "Pepsi", desc: "",
    variantes: [{ nome: "Lata 350ml", preco: 5 }, { nome: "1L", preco: 9 }] },
  { id: "fanta-laranja", cat: "bebidas", nome: "Fanta Laranja", desc: "",
    variantes: [{ nome: "250ml", preco: 3.5 }, { nome: "Lata 350ml", preco: 5 }, { nome: "2L", preco: 12 }] },
  { id: "fanta-uva", cat: "bebidas", nome: "Fanta Uva", desc: "",
    variantes: [{ nome: "250ml", preco: 3.5 }, { nome: "Lata 350ml", preco: 5 }, { nome: "2L", preco: 12 }] },
  { id: "cajuina", cat: "bebidas", nome: "Cajuína São Geraldo", desc: "A cajuína do Ceará.",
    variantes: [{ nome: "Lata 350ml", preco: 5 }, { nome: "1L", preco: 10 }, { nome: "2L", preco: 15 }] },
  { id: "sprite", cat: "bebidas", nome: "Sprite", desc: "",
    variantes: [{ nome: "250ml", preco: 3.5 }, { nome: "Lata 350ml", preco: 5 }] },
  { id: "agua", cat: "bebidas", nome: "Água Mineral 500ml", desc: "", preco: 2.5 },
  { id: "agua-gas", cat: "bebidas", nome: "Água com Gás 500ml", desc: "", preco: 3 },

  // ---------- Sucos e Vitaminas (400ml) ----------
  { id: "suco", cat: "sucos", nome: "Suco 400ml", desc: "Suco de fruta.", preco: 0,
    escolhas: [{ nome: "Sabor", max: 1, modo: "maior", itens: FRUTAS.map((f) => ({ nome: f, preco: 5 })).concat([{ nome: "Laranja", preco: 6 }]) }] },
  { id: "vitamina", cat: "sucos", nome: "Vitamina 400ml", desc: "Batida com leite.", preco: 7,
    escolhas: [{ nome: "Sabor", itens: FRUTAS }] },

  // ---------- Brownies ----------
  { id: "brownie-brigadeiro", cat: "brownies", nome: "Brownie Brigadeiro", preco: 6 },
  { id: "brownie-branquinho", cat: "brownies", nome: "Brownie Branquinho", preco: 6 },
];
