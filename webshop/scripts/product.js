(function(){
  "use strict";

  function initProduct(){
    var store = Gruschd.store;
    var mount = document.getElementById('product');
    var id = (Gruschd.qs && Gruschd.qs('id')) || 'smokebloke';
    var p = store.getProduct(id);
    if (!p){
      mount.innerHTML = '<div class="card"><div class="pad"><h2>Produkt nicht gefunden</h2><p class="help">Zurück zum <a href="shop.html">Shop</a>.</p></div></div>';
      return;
    }

    var mode = 'standard';
    var tiersRows = p.tiers.map(function(t){
      var total = t.pieces * t.unit;
      return '<tr><td><strong>'+store.formatPieces(t.pieces)+'</strong></td><td>'+store.formatEUR(t.unit)+'</td><td>'+store.formatEUR(total)+'</td></tr>';
    }).join('');

    mount.innerHTML =
      '<div class="card">'
        +'<div class="pad-lg">'
          +'<div class="kicker">'
            +'<span class="pill">Kategorie <strong>Kioskartikel</strong></span>'
            +'<span class="pill">inkl. <strong>1 Display</strong></span>'
            +'<span class="pill">inkl. <strong>MwSt.</strong></span>'
          +'</div>'
          +'<h1 class="product-title">'+p.name+'</h1>'
          +'<p class="help" style="margin:10px 0 0">'+p.short+'</p>'
          +'<p class="fine" style="margin:10px 0 0">'+p.includes+'</p>'

          +'<div style="height:14px"></div>'
          +'<div class="grid grid-2">'
            +'<div class="card" style="box-shadow:none">'
              +'<div class="pad">'
                +'<div class="chip"><span class="dot" aria-hidden="true"></span> Details</div>'
                +'<div style="height:10px"></div>'
                +'<h3 style="margin:0 0 6px">'+p.standardMix.title+'</h3>'
                +'<ul style="margin:0 0 10px; padding-left:18px" class="help">'
                  +p.standardMix.bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('')
                +'</ul>'
                +'<h3 style="margin:14px 0 6px">'+p.customDesign.title+'</h3>'
                +'<p class="help" style="margin:0 0 8px">Ab <strong>'+store.formatPieces(p.customDesign.minPieces)+'</strong> Stück · + <strong>'+store.formatEUR(p.customDesign.designFee)+'</strong> Designpauschale (einmalig pro Motiv)</p>'
                +'<p class="fine" style="margin:0 0 8px">'+p.customDesign.note+'</p>'
                +'<p class="fine" style="margin:0">'+p.customDesign.includes+'</p>'

                +'<div style="height:14px"></div>'
                +'<h3 style="margin:0 0 6px">'+p.leadtime.title+'</h3>'
                +'<p class="help" style="margin:0">'+p.leadtime.text+'</p>'

                +'<div style="height:14px"></div>'
                +'<div class="chip" style="border-color: rgba(85,214,255,.25); background: rgba(85,214,255,.08)"><span class="dot" style="background:var(--accent3)" aria-hidden="true"></span> Bei Interesse an Individualisierung: <a href="contact.html">Kontakt aufnehmen</a></div>'
              +'</div>'
            +'</div>'

            +'<div class="pricebox" id="buy">'
              +'<div class="kicker">'
                +'<span class="chip"><span class="dot" aria-hidden="true"></span> Kaufen</span>'
                +'<span class="pill">Vorkasse <strong>Überweisung</strong></span>'
              +'</div>'
              +'<div style="height:12px"></div>'

              +'<div class="tabs" role="tablist" aria-label="Modus">'
                +'<button class="tab" id="tab-standard" type="button" aria-selected="true">Standard‑Mix</button>'
                +'<button class="tab" id="tab-custom" type="button" aria-selected="false">Individuelles Design</button>'
              +'</div>'

              +'<div style="height:12px"></div>'
              +'<div class="row">'
                +'<div>'
                  +'<label for="tier">Stückzahl (pro Paket)</label>'
                  +'<select id="tier"></select>'
                +'</div>'
                +'<div>'
                  +'<label for="packs">Pakete</label>'
                  +'<input id="packs" type="number" min="1" max="999" value="1" />'
                +'</div>'
              +'</div>'

              +'<div style="height:10px"></div>'
              +'<div id="custom-area" style="display:none">'
                +'<div class="row">'
                  +'<div>'
                    +'<label for="motifs">Motive</label>'
                    +'<input id="motifs" type="number" min="1" max="99" value="1" />'
                  +'</div>'
                  +'<div>'
                    +'<label>&nbsp;</label>'
                    +'<div class="fine" style="padding:10px 0">+ '+store.formatEUR(p.customDesign.designFee)+' pro Motiv (einmalig)</div>'
                  +'</div>'
                +'</div>'
                +'<div class="fine" id="custom-warning" style="margin-top:8px"></div>'
              +'</div>'

              +'<div style="height:12px"></div>'
              +'<div class="card" style="box-shadow:none">'
                +'<div class="pad" style="padding:14px">'
                  +'<div class="fine">Stückpreis</div>'
                  +'<div class="price-big" id="unit">–</div>'
                  +'<div class="fine">Gesamt (inkl. MwSt.)</div>'
                  +'<div class="price-big" id="total">–</div>'
                  +'<div class="fine">Versand wird im Checkout hinzugefügt (extra).</div>'
                +'</div>'
              +'</div>'

              +'<div style="height:12px"></div>'
              +'<button class="btn btn-primary" id="add" type="button">In den Warenkorb</button>'
              +'<a class="btn btn-ghost" href="cart.html" style="margin-left:8px">Zum Warenkorb</a>'

              +'<div style="height:12px"></div>'
              +'<details>'
                +'<summary class="fine" style="cursor:pointer">Staffelpreise (Standard‑Mix)</summary>'
                +'<div style="height:10px"></div>'
                +'<table>'
                  +'<thead><tr><th>Stück</th><th>€/Stk.</th><th>Gesamt</th></tr></thead>'
                  +'<tbody>'+tiersRows+'</tbody>'
                +'</table>'
                +'<div class="fine" style="margin-top:8px">👉 ab 0,25 € / Stück (ab 2.000 Stück)</div>'
              +'</details>'
            +'</div>'
          +'</div>'
        +'</div>'
      +'</div>';

    var tierSel = document.getElementById('tier');
    var packsInp = document.getElementById('packs');
    var motifsInp = document.getElementById('motifs');
    var customArea = document.getElementById('custom-area');
    var warn = document.getElementById('custom-warning');
    var unitEl = document.getElementById('unit');
    var totalEl = document.getElementById('total');
    var tabStandard = document.getElementById('tab-standard');
    var tabCustom = document.getElementById('tab-custom');
    var addBtn = document.getElementById('add');

    // fill tiers
    p.tiers.forEach(function(t){
      var opt = document.createElement('option');
      opt.value = String(t.pieces);
      opt.textContent = store.formatPieces(t.pieces)+' Stück · '+store.formatEUR(t.unit)+' / Stk.';
      tierSel.appendChild(opt);
    });

    function setMode(next){
      mode = next;
      tabStandard.setAttribute('aria-selected', String(mode==='standard'));
      tabCustom.setAttribute('aria-selected', String(mode==='custom'));
      customArea.style.display = (mode==='custom') ? 'block' : 'none';
      recalc();
    }

    function recalc(){
      var tierPieces = Number(tierSel.value);
      var packs = clamp(Number(packsInp.value),1,999);
      packsInp.value = String(packs);
      var motifs = clamp(Number(motifsInp.value||1),1,99);
      motifsInp.value = String(motifs);

      var tier = store.getTier(p, tierPieces);
      var unit = tier.unit;
      var piecesTotal = tierPieces * packs;
      var subtotal = piecesTotal * unit;

      var designFee = 0;
      var canCustom = tierPieces >= p.customDesign.minPieces;
      if (mode==='custom'){
        if (!canCustom){
          warn.innerHTML = '⚠️ Individuelles Design ist ab <strong>'+store.formatPieces(p.customDesign.minPieces)+'</strong> Stück verfügbar. Bitte Stückzahl erhöhen oder Standard‑Mix wählen.';
          warn.style.color = 'var(--danger)';
          addBtn.disabled = true;
        } else {
          warn.innerHTML = '✓ Umsetzbarkeit prüfen wir vorab kostenlos. (+ '+store.formatEUR(p.customDesign.designFee)+' pro Motiv, einmalig)';
          warn.style.color = 'var(--muted)';
          addBtn.disabled = false;
          designFee = p.customDesign.designFee * motifs;
        }
      } else {
        warn.textContent = '';
        addBtn.disabled = false;
      }

      unitEl.textContent = store.formatEUR(unit)+' / Stk.';
      totalEl.textContent = store.formatEUR(subtotal + designFee);
    }

    tabStandard.addEventListener('click', function(){ setMode('standard'); });
    tabCustom.addEventListener('click', function(){ setMode('custom'); });
    tierSel.addEventListener('change', recalc);
    packsInp.addEventListener('input', recalc);
    motifsInp.addEventListener('input', recalc);

    addBtn.addEventListener('click', function(){
      var tierPieces = Number(tierSel.value);
      var tier = store.getTier(p, tierPieces);
      var packs = clamp(Number(packsInp.value),1,999);
      var motifs = clamp(Number(motifsInp.value||1),1,99);
      store.addToCart({
        productId: p.id,
        mode: mode,
        tierPieces: tier.pieces,
        unitPrice: tier.unit,
        packs: packs,
        motifs: motifs,
      });
      if (Gruschd.updateCartBadge) Gruschd.updateCartBadge();
      addBtn.textContent = 'Hinzugefügt ✓';
      setTimeout(function(){ addBtn.textContent = 'In den Warenkorb'; }, 900);
    });

    recalc();
  }

  function clamp(n,min,max){
    if (!isFinite(n)) return min;
    return Math.max(min, Math.min(max, Math.floor(n)));
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initProduct = initProduct;

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('product')) initProduct();
  });
})();