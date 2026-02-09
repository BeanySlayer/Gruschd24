(function(){
  "use strict";

  function initCart(){
    var store = Gruschd.store;
    var mount = document.getElementById('items');
    var summary = document.getElementById('summary');
    var clearBtn = document.getElementById('clear');
    var toCheckout = document.getElementById('to-checkout');

    function render(){
      var cart = store.loadCart();
      if (Gruschd.updateCartBadge) Gruschd.updateCartBadge();

      // reset checkout button state
      toCheckout.removeAttribute('aria-disabled');
      toCheckout.classList.add('btn-primary');
      toCheckout.classList.remove('btn-ghost');

      mount.innerHTML='';
      if (cart.length===0){
        mount.innerHTML = '<div class="card"><div class="pad-lg"><h2 style="margin:0 0 6px">Dein Warenkorb ist leer.</h2><p class="help" style="margin:0">Zurück zum <a href="shop.html">Shop</a>.</p></div></div>';
        summary.innerHTML = '';
        toCheckout.setAttribute('aria-disabled','true');
        toCheckout.classList.add('btn-ghost');
        toCheckout.classList.remove('btn-primary');
        return;
      }

      cart.forEach(function(item){
        var p = store.getProduct(item.productId);
        var pieces = item.tierPieces * item.packs;
        var lineSubtotal = pieces * item.unitPrice;
        var designFee = item.mode==='custom' ? 50 * item.motifs : 0;
        var lineTotal = lineSubtotal + designFee;

        var card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '16px';
        card.innerHTML =
          '<div class="pad-lg">'
            +'<div class="kicker">'
              +'<span class="pill">'+(p?p.name:'Artikel')+' <strong>'+(item.mode==='custom'?'Custom':'Standard')+'</strong></span>'
              +'<span class="pill">Paket <strong>'+store.formatPieces(item.tierPieces)+'</strong> Stk.</span>'
              +'<span class="pill">'+store.formatEUR(item.unitPrice)+' <strong>/ Stk.</strong></span>'
            +'</div>'
            +'<div style="height:10px"></div>'
            +'<div class="grid" style="grid-template-columns: 1fr 1fr; gap:12px">'
              +'<div>'
                +'<label>Pakete</label>'
                +'<input type="number" min="1" max="999" value="'+item.packs+'" data-packs="'+item.id+'" />'
                +'<div class="fine">Gesamtstücke: '+store.formatPieces(pieces)+'</div>'
              +'</div>'
              +'<div '+(item.mode==='custom'?'':'style="opacity:.55"')+'>'
                +'<label>Motive (nur Custom)</label>'
                +'<input type="number" min="1" max="99" value="'+item.motifs+'" data-motifs="'+item.id+'" '+(item.mode==='custom'?'':'disabled')+' />'
                +'<div class="fine">Designpauschale: '+(item.mode==='custom'?store.formatEUR(designFee):'–')+'</div>'
              +'</div>'
            +'</div>'
            +'<div style="height:12px"></div>'
            +'<div class="kicker" style="justify-content:space-between">'
              +'<div class="help"><strong>Zwischensumme:</strong> '+store.formatEUR(lineTotal)+'</div>'
              +'<button class="btn btn-danger" type="button" data-remove="'+item.id+'">Entfernen</button>'
            +'</div>'
            +(item.mode==='custom' ? '<div class="fine" style="margin-top:10px">Custom: Designpauschale ist einmalig pro Motiv (nicht pro Paket). Umsetzbarkeit prüfen wir kostenlos vorab.</div>' : '')
          +'</div>';
        mount.appendChild(card);
      });

      var totals = store.cartTotals(cart);
      summary.innerHTML =
        '<div><strong>Artikel (Stück):</strong> '+store.formatPieces(totals.piecesTotal)+'</div>'
        +'<div><strong>Warenwert:</strong> '+store.formatEUR(totals.subtotal)+'</div>'
        +'<div><strong>Designpauschalen:</strong> '+store.formatEUR(totals.designFeeTotal)+'</div>'
        +'<div style="height:8px"></div>'
        +'<div style="font-size:18px"><strong>Gesamt:</strong> '+store.formatEUR(totals.total)+'</div>';
    }

    mount.addEventListener('input', function(e){
      var el = e.target;
      if (!el || !el.dataset) return;
      var id = el.dataset.packs || el.dataset.motifs;
      if (!id) return;
      if (el.dataset.packs) store.updateCartItem(id, { packs: el.value });
      if (el.dataset.motifs) store.updateCartItem(id, { motifs: el.value });
      render();
    });

    mount.addEventListener('click', function(e){
      var btn = e.target && e.target.closest ? e.target.closest('[data-remove]') : null;
      if (!btn) return;
      store.removeCartItem(btn.getAttribute('data-remove'));
      render();
    });

    clearBtn.addEventListener('click', function(){
      store.clearCart();
      render();
    });

    render();
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initCart = initCart;

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('items')) initCart();
  });
})();