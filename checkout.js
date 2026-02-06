/*
 * Skript für die Checkout‑Seite. Es verarbeitet das Absenden des Formulars,
 * simuliert eine Bestellbestätigung und leert den Warenkorb.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const confirmation = document.getElementById('confirmation');
  form.addEventListener('submit', event => {
    event.preventDefault();
    // Hier würde normalerweise eine Serveranfrage zur Zahlungsabwicklung gesendet
    // werden. Für diesen Demo‑Shop simulieren wir einfach eine erfolgreiche
    // Bestellung.
    // Warenkorb leeren
    localStorage.removeItem('cart');
    // Formular ausblenden und Bestätigung anzeigen
    form.style.display = 'none';
    confirmation.classList.remove('hidden');
    // Anzahl im Navigationslink auf Null setzen
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      countEl.textContent = '0';
    }
  });
});