(function(){
  "use strict";

  var BANK = {
    empfaenger: 'gruschd24.de',
    iban: 'DE00 0000 0000 0000 0000 00',
    bic: 'XXXXDEXXxxx',
    bank: 'Deine Bank',
  };

  function initCheckout(){
    var store = Gruschd.store;
    var orderBox = document.getElementById('order');
    var form = document.getElementById('form');
    var confirmation = document.getElementById('confirmation');
    var paybox = document.querySelector('#paybox .pad');

    var cart = store.loadCart();
    if (Gruschd.updateCartBadge) Gruschd.updateCartBadge();

    if (cart.length===0){
      orderBox.innerHTML = '<p><strong>Dein Warenkorb ist leer.</strong> Bitte gehe zurück zum <a href="shop.html">Shop</a>.</p>';
      form.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    var totals = store.cartTotals(cart);
    orderBox.innerHTML =
      '<table>'
        +'<thead><tr><th>Artikel</th><th>Details</th><th>Summe</th></tr></thead>'
        +'<tbody>'
          +cart.map(function(item){
            var p = store.getProduct(item.productId);
            var pieces = item.tierPieces * item.packs;
            var subtotal = pieces * item.unitPrice;
            var designFee = item.mode==='custom' ? 50 * item.motifs : 0;
            var total = subtotal + designFee;
            var details = store.formatPieces(item.tierPieces)+' Stk/Paket × '+item.packs+' Paket(e) = '+store.formatPieces(pieces)+' Stk · '+store.formatEUR(item.unitPrice)+'/Stk';
            var mode = (item.mode==='custom')
              ? ('Custom · '+item.motifs+' Motiv(e) · + '+store.formatEUR(designFee)+' Designpauschale')
              : 'Standard‑Mix';
            return '<tr>'
              +'<td><strong>'+(p?p.name:'Artikel')+'</strong></td>'
              +'<td>'+details+'<div class="fine">'+mode+'</div></td>'
              +'<td><strong>'+store.formatEUR(total)+'</strong></td>'
            +'</tr>';
          }).join('')
        +'</tbody>'
      +'</table>'
      +'<div style="height:10px"></div>'
      +'<div><strong>Warenwert:</strong> '+store.formatEUR(totals.subtotal)+'</div>'
      +'<div><strong>Designpauschalen:</strong> '+store.formatEUR(totals.designFeeTotal)+'</div>'
      +'<div style="height:8px"></div>'
      +'<div style="font-size:18px"><strong>Gesamt:</strong> '+store.formatEUR(totals.total)+'</div>';

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var orderNo = makeOrderNo();
      var amount = totals.total;
      var reference = 'Bestellung ' + orderNo;

      paybox.innerHTML =
        '<div class="kicker">'
          +'<span class="pill">Bestellnr. <strong>'+orderNo+'</strong></span>'
          +'<span class="pill">Betrag <strong>'+store.formatEUR(amount)+'</strong></span>'
        +'</div>'
        +'<div style="height:12px"></div>'
        +'<table><tbody>'
          +'<tr><th>Empfänger</th><td>'+BANK.empfaenger+'</td></tr>'
          +'<tr><th>IBAN</th><td><strong>'+BANK.iban+'</strong></td></tr>'
          +'<tr><th>BIC</th><td>'+BANK.bic+'</td></tr>'
          +'<tr><th>Bank</th><td>'+BANK.bank+'</td></tr>'
          +'<tr><th>Verwendungszweck</th><td><strong>'+reference+'</strong></td></tr>'
        +'</tbody></table>'
        +'<div style="height:10px"></div>'
        +'<div class="fine">Versand/Produktion startet nach Zahlungseingang. Für Custom‑Design prüfen wir die Umsetzbarkeit kostenlos vorab.</div>';

      store.clearCart();
      if (Gruschd.updateCartBadge) Gruschd.updateCartBadge();

      confirmation.style.display = 'block';
      confirmation.scrollIntoView({behavior:'smooth', block:'start'});
      form.querySelector('button[type="submit"]').disabled = true;
    });
  }

  function makeOrderNo(){
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth()+1).padStart(2,'0');
    var day = String(d.getDate()).padStart(2,'0');
    var rnd = Math.floor(Math.random()*9000)+1000;
    return 'GR-'+y+m+day+'-'+rnd;
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initCheckout = initCheckout;
  window.Gruschd.BANK = BANK; // quick edit in browser if needed

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('form') && document.getElementById('order')) initCheckout();
  });
})();