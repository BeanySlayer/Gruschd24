(function () {
  "use strict";

  // Versioned key to avoid "Artikel fehlt" after updates.
  var STORE_VERSION = "gruschd24-v1";
  var CART_KEY = STORE_VERSION + ":cart";

  var categories = [
    { id: "kioskartikel", name: "Kioskartikel" },
    { id: "zubehoer", name: "Zubehör" },
    { id: "merch", name: "Merch" },
  ];

  var products = [
    {
      id: "smokebloke",
      name: "SmokeBloke",
      categoryId: "kioskartikel",
      short: "Individuelle Jointhülsen aus PLA‑Bioplastik – Standard‑Mix oder dein eigenes Design.",
      tags: ["pla", "bioplastik", "jointhülsen", "display"],
      includes: "Alle Pakete inkl. 1 Display. Alle Preise inkl. MwSt. · Versand extra.",
      standardMix: {
        title: "STANDARD‑MIX",
        bullets: [
          "Bunte Mixauswahl (freie Farbmischung)",
          "Alle Preise inkl. MwSt. · Versand extra",
        ],
      },
      customDesign: {
        title: "INDIVIDUELLES DESIGN",
        minPieces: 500,
        designFee: 50,
        note: "Umsetzbarkeit prüfen wir vorab kostenlos. Sehr filigrane oder komplexe Motive ggf. vereinfacht.",
        includes: "Designpauschale inkl. Datencheck + 1 Korrekturrunde.",
      },
      leadtime: {
        title: "LIEFERZEIT",
        text: "Produktion: je nach Auftragslage bis zu 7 Tage. Größere Mengen (z. B. ab 2.000 Stück/Sondermengen): nach Absprache.",
      },
      tiers: [
        { pieces: 24, unit: 0.95 },
        { pieces: 50, unit: 0.79 },
        { pieces: 100, unit: 0.69 },
        { pieces: 500, unit: 0.39 },
        { pieces: 1000, unit: 0.29 },
        { pieces: 2000, unit: 0.25 },
      ],
    },
  ];

  function formatEUR(amount) {
    try {
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
    } catch (e) {
      return (Math.round(amount * 100) / 100).toFixed(2) + " €";
    }
  }

  function formatPieces(n) {
    try {
      return new Intl.NumberFormat("de-DE").format(n);
    } catch (e) {
      return String(n);
    }
  }

  function getProduct(id) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return null;
  }

  function getTier(product, pieces) {
    for (var i = 0; i < product.tiers.length; i++) {
      if (product.tiers[i].pieces === pieces) return product.tiers[i];
    }
    return product.tiers[0];
  }

  // Cart item schema:
  // { id, productId, mode: 'standard'|'custom', tierPieces, unitPrice, packs, motifs }

  function loadCart() {
    var raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
      var cart = JSON.parse(raw);
      if (!Array.isArray(cart)) return [];
      var out = [];
      for (var i = 0; i < cart.length; i++) {
        var it = cart[i] || {};
        if (!getProduct(it.productId)) continue;
        out.push({
          id: String(it.id || cryptoRandomId()),
          productId: it.productId,
          mode: it.mode === "custom" ? "custom" : "standard",
          tierPieces: Number(it.tierPieces) || 24,
          unitPrice: Number(it.unitPrice) || 0,
          packs: clampInt(it.packs, 1, 999),
          motifs: clampInt(it.motifs, 1, 99),
        });
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function addToCart(payload) {
    var cart = loadCart();
    var normalized = {
      id: cryptoRandomId(),
      productId: payload.productId,
      mode: payload.mode === "custom" ? "custom" : "standard",
      tierPieces: Number(payload.tierPieces),
      unitPrice: Number(payload.unitPrice),
      packs: clampInt(payload.packs, 1, 999),
      motifs: clampInt(payload.motifs, 1, 99),
    };

    // Merge if same product + same mode + same tier + same motifs (custom)
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      var it = cart[i];
      if (
        it.productId === normalized.productId &&
        it.mode === normalized.mode &&
        it.tierPieces === normalized.tierPieces &&
        (it.mode !== "custom" || it.motifs === normalized.motifs)
      ) {
        existing = it;
        break;
      }
    }

    if (existing) {
      existing.packs = clampInt(existing.packs + normalized.packs, 1, 999);
    } else {
      cart.push(normalized);
    }

    saveCart(cart);
    return cart;
  }

  function updateCartItem(id, patch) {
    var cart = loadCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        if (patch.packs !== undefined) cart[i].packs = clampInt(patch.packs, 1, 999);
        if (patch.motifs !== undefined) cart[i].motifs = clampInt(patch.motifs, 1, 99);
        break;
      }
    }
    saveCart(cart);
    return cart;
  }

  function removeCartItem(id) {
    var cart = loadCart().filter(function (i) { return i.id !== id; });
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function cartCount(cart) {
    if (!cart) cart = loadCart();
    var sum = 0;
    for (var i = 0; i < cart.length; i++) sum += Number(cart[i].packs) || 0;
    return sum;
  }

  function cartTotals(cart) {
    if (!cart) cart = loadCart();
    var subtotal = 0;
    var piecesTotal = 0;
    var designFeeTotal = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var pieces = item.tierPieces * item.packs;
      piecesTotal += pieces;
      subtotal += pieces * item.unitPrice;
      if (item.mode === "custom") designFeeTotal += 50 * (item.motifs || 1);
    }
    return { subtotal: subtotal, designFeeTotal: designFeeTotal, total: subtotal + designFeeTotal, piecesTotal: piecesTotal };
  }

  function cryptoRandomId() {
    try {
      if (window.crypto && crypto.getRandomValues) {
        var buf = new Uint32Array(2);
        crypto.getRandomValues(buf);
        return buf[0].toString(16) + buf[1].toString(16);
      }
    } catch (e) {}
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  function clampInt(v, min, max) {
    var n = Math.floor(Number(v));
    if (!isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  // Expose
  window.Gruschd = window.Gruschd || {};
  window.Gruschd.store = {
    STORE_VERSION: STORE_VERSION,
    categories: categories,
    products: products,
    formatEUR: formatEUR,
    formatPieces: formatPieces,
    getProduct: getProduct,
    getTier: getTier,
    loadCart: loadCart,
    saveCart: saveCart,
    addToCart: addToCart,
    updateCartItem: updateCartItem,
    removeCartItem: removeCartItem,
    clearCart: clearCart,
    cartCount: cartCount,
    cartTotals: cartTotals,
  };
})();
