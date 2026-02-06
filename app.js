/*
 * Dieses Skript verwaltet die Startseite des Webshops: es rendert die Produktkarten,
 * verwaltet den Warenkorb und speichert Produktdaten in localStorage für die Nutzung
 * auf anderen Seiten (z.B. im Warenkorb oder bei der Kasse).
 */

// Liste der verfügbaren Produkte
const products = [
  {
    id: 1,
    name: 'Stylisches T‑Shirt',
    price: 19.99,
    description: 'Ein bequemes T‑Shirt aus weicher Baumwolle für den Alltag.',
    image: 'https://picsum.photos/300?random=11'
  },
  {
    id: 2,
    name: 'Modische Sonnenbrille',
    price: 29.99,
    description: 'Schützt Ihre Augen und sieht dabei gut aus – perfekt für sonnige Tage.',
    image: 'https://picsum.photos/300?random=22'
  },
  {
    id: 3,
    name: 'Elegante Armbanduhr',
    price: 79.99,
    description: 'Diese Uhr kombiniert Stil und Funktionalität für jeden Anlass.',
    image: 'https://picsum.photos/300?random=33'
  },
  {
    id: 4,
    name: 'Bequeme Sneaker',
    price: 59.99,
    description: 'Leichte und trendige Schuhe für Sport und Freizeit.',
    image: 'https://picsum.photos/300?random=44'
  },
  {
    id: 5,
    name: 'Praktischer Rucksack',
    price: 39.99,
    description: 'Geräumiger Rucksack mit vielen Fächern, ideal für unterwegs.',
    image: 'https://picsum.photos/300?random=55'
  },
  {
    id: 6,
    name: 'Kabellose Kopfhörer',
    price: 49.99,
    description: 'Genießen Sie Ihre Musik ohne Kabelsalat mit diesen hochwertigen Kopfhörern.',
    image: 'https://picsum.photos/300?random=66'
  }
];

// Speichert die Produkte zur Wiederverwendung im localStorage
function storeProducts() {
  try {
    localStorage.setItem('products', JSON.stringify(products));
  } catch (err) {
    console.error('Kann Produkte nicht im localStorage speichern:', err);
  }
}

// Lädt die aktuelle Anzahl der Warenkorbartikel und zeigt sie in der Navigationsleiste an
function loadCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

// Rendert die Produkte auf der Startseite
function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${product.price.toFixed(2)} €</p>
      <button data-id="${product.id}">In den Warenkorb</button>
    `;
    container.appendChild(card);
  });
  // Event-Delegation für alle "In den Warenkorb"-Buttons
  container.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
      const id = parseInt(event.target.getAttribute('data-id'), 10);
      addToCart(id);
    }
  });
}

// Fügt ein Produkt zum Warenkorb hinzu (oder erhöht die Menge)
function addToCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartCount();
}

// Wird ausgeführt, wenn die Seite vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
  storeProducts();
  renderProducts();
  loadCartCount();
});