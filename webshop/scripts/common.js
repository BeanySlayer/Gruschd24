(function(){
  "use strict";

  function setActiveNav(){
    var path = (location.pathname.split('/').pop() || 'index.html');
    var links = document.querySelectorAll('[data-nav] a');
    for (var i=0;i<links.length;i++){
      var href = (links[i].getAttribute('href') || '').split('/').pop();
      if (href === path) links[i].setAttribute('aria-current','page');
    }
  }

  function updateCartBadge(){
    var el = document.getElementById('cart-count');
    if (!el) return;
    var count = (window.Gruschd && Gruschd.store) ? Gruschd.store.cartCount(Gruschd.store.loadCart()) : 0;
    el.textContent = String(count);
  }

  function initCommon(){
    setActiveNav();
    updateCartBadge();
    window.addEventListener('storage', function(e){
      if (e.key && e.key.indexOf(':cart') !== -1) updateCartBadge();
    });
  }

  function qs(name){
    return new URLSearchParams(location.search).get(name);
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initCommon = initCommon;
  window.Gruschd.updateCartBadge = updateCartBadge;
  window.Gruschd.qs = qs;

  document.addEventListener('DOMContentLoaded', initCommon);
})();