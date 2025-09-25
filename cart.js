// cart.js
import firebaseConfig from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

async function renderCart() {
  cartItemsEl.innerHTML = '';
  const cart = JSON.parse(localStorage.getItem('oa_cart') || '{}');
  let total = 0;
  for (const id in cart) {
    const qty = cart[id];
    const snap = await getDoc(doc(db,'products',id));
    if (!snap.exists()) continue;
    const p = snap.data();
    const line = document.createElement('div');
    line.className = 'cart-item';
    line.innerHTML = `
      <img src="${p.image}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
      <div style="flex:1">
        <b>${p.name}</b><br>₹${p.price} x ${qty} = ₹${p.price * qty}
      </div>
      <div>
        <button class="btn" onclick="removeItem('${id}')">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(line);
    total += p.price * qty;
  }
  cartTotalEl.innerText = 'Total: ₹' + total;
  checkoutBtn.onclick = () => startCheckout(total, cart);
}
window.removeItem = function(id) {
  const cart = JSON.parse(localStorage.getItem('oa_cart') || '{}');
  delete cart[id];
  localStorage.setItem('oa_cart', JSON.stringify(cart));
  renderCart();
};
renderCart();

async function startCheckout(totalINR, cart) {
  if (!totalINR || totalINR <= 0) { alert('Cart is empty'); return; }
  // Call Netlify function to create Razorpay order
  const resp = await fetch('/.netlify/functions/create-order', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ amount: totalINR, cart })
  });
  const data = await resp.json();
  if (!data.success) { alert('Order error: ' + (data.error || 'Unknown')); return; }

  // Open Razorpay Checkout using returned order id and key id
  const options = {
    "key": data.key_id,
    "amount": data.order.amount,
    "currency": data.order.currency,
    "name": "Omkar Antiques",
    "description": "Order Payment",
    "order_id": data.order.id,
    "handler": function (response){
      localStorage.removeItem('oa_cart');
      alert('Payment successful! Payment id: ' + response.razorpay_payment_id);
      window.location = 'index.html';
    },
    "prefill": {"name": "", "email": ""},
    "theme": {"color": "#C19A6B"}
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
