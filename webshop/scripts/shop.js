(function(){
  "use strict";

  function initShop(){
    var store = Gruschd.store;
    var tabs = document.getElementById('category-tabs');
    var grid = document.getElementById('grid');
    var empty = document.getElementById('empty');
    var q = document.getElementById('q');
    var sort = document.getElementById('sort');

    var activeCat = (new URLSearchParams(location.search).get('cat')) || 'kioskartikel';

    function catName(id){
      for (var i=0;i<store.categories.length;i++) if (store.categories[i].id===id) return store.categories[i].name;
      return id;
    }

    function lowestUnitPrice(p){
      var min = Infinity;
      for (var i=0;i<p.tiers.length;i++) min = Math.min(min, p.tiers[i].unit);
      return min;
    }

    function renderTabs(){
      tabs.innerHTML = '';
      store.categories.forEach(function(c){
        var b = document.createElement('button');
        b.className = 'tab';
        b.type = 'button';
        b.setAttribute('role','tab');
        b.setAttribute('aria-selected', String(c.id===activeCat));
        b.textContent = c.name;
        b.addEventListener('click', function(){
          activeCat = c.id;
          history.replaceState({},'', 'shop.html?cat='+encodeURIComponent(activeCat));
          renderTabs();
          renderGrid();
        });
        tabs.appendChild(b);
      });
    }

    function sortProducts(list){
      var v = sort.value;
      var copy = list.slice();
      if (v === 'name') copy.sort(function(a,b){ return a.name.localeCompare(b.name,'de'); });
      if (v === 'price_low') copy.sort(function(a,b){ return lowestUnitPrice(a)-lowestUnitPrice(b); });
      if (v === 'price_high') copy.sort(function(a,b){ return lowestUnitPrice(b)-lowestUnitPrice(a); });
      return copy;
    }

    function renderGrid(){
      var term = (q.value||'').trim().toLowerCase();
      var list = store.products.filter(function(p){ return p.categoryId===activeCat; });
      if (term){
        list = list.filter(function(p){
          var hay = (p.name+' '+p.short+' '+(p.tags||[]).join(' ')).toLowerCase();
          return hay.indexOf(term)!==-1;
        });
      }
      list = sortProducts(list);
      grid.innerHTML = '';
      if (list.length===0){
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';
      list.forEach(function(p){
        var from = lowestUnitPrice(p);
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML =
          '<div class="pad">'
            +'<div class="kicker">'
              +'<span class="pill">Kategorie <strong>'+catName(p.categoryId)+'</strong></span>'
              +'<span class="pill">ab <strong>'+store.formatEUR(from)+' / Stk.</strong></span>'
            +'</div>'
            +'<h3 class="product-title" style="margin-top:10px">'+p.name+'</h3>'
            +'<p class="help" style="margin:8px 0 14px">'+p.short+'</p>'
            +'<div class="hero-actions">'
              +'<a class="btn btn-primary" href="product.html?id='+encodeURIComponent(p.id)+'">Details</a>'
              +'<a class="btn btn-ghost" href="product.html?id='+encodeURIComponent(p.id)+'#buy">Kaufen</a>'
            +'</div>'
          +'</div>';
        grid.appendChild(card);
      });
    }

    q.addEventListener('input', renderGrid);
    sort.addEventListener('change', renderGrid);
    renderTabs();
    renderGrid();
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initShop = initShop;

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('grid')) initShop();
  });
})();