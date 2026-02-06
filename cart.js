/*
 * Skript für die Warenkorb‑Seite. Es lädt die im localStorage gespeicherten
 * Warenkorbdaten, stellt sie dar und ermöglicht dem Nutzer das Anpassen
 * der Mengen oder das Entfernen von Artikeln.
 */

// Lädt die Warenkorbpositionen und rendert sie
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  container.innerHTML = '';
  let total = 0;
  // Für jede Warenkorbposition das zugehörige Produkt finden und anzeigen
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="item-info">
          <h3>${product.name}</h3>
          <p>Preis: ${product.price.toFixed(2)} €</p>
          <div class="quantity">
            <button class="decrease" data-id="${product.id}">−</button>
            <span>${item.quantity}</span>
            <button class="increase" data-id="${product.id}">+</button>
          </div>
          <p>Summe: ${itemTotal.toFixed(2)} €</p>
          <button class="remove" data-id="${product.id}">Entfernen</button>
        </div>
      `;
      container.appendChild(div);
    }
  });
  totalEl.textContent = `${total.toFixed(2)} €`;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = count;
}

// Aktualisiert die Menge eines Artikels um delta (z.B. +1 oder −1)
function updateQuantity(id, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(it => it.id === id);
  if (item) {
    item.quantity += delta;
    // Wenn die Menge auf null sinkt, entferne den Artikel komplett
    if (item.quantity <= 0) {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
}

// Entfernt einen Artikel komplett aus dem Warenkorb
function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Registrierung der Eventlistener nach dem Laden des DOMs
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  const container = document.getElementById('cart-items');
  container.addEventListener('click', event => {
    const id = parseInt(event.target.dataset.id, 10);
    if (event.target.classList.contains('increase')) {
      updateQuantity(id, 1);
    }
    if (event.target.classList.contains('decrease')) {
      updateQuantity(id, -1);
    }
    if (event.target.classList.contains('remove')) {
      removeItem(id);
    }
  });
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
});