// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js'; // Make sure this exports firebaseConfig

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productListEl = document.getElementById('product-list');
const cartCountEl = document.getElementById('cart-count');

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('oa_cart') || '{}');
  let totalQty = 0;
  for (const k in cart) totalQty += cart[k];
  cartCountEl.innerText = totalQty;
}
updateCartCount();

async function loadProducts() {
  productListEl.innerHTML = `<p>Loading...</p>`;
  const q = query(collection(db, 'products'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  productListEl.innerHTML = '';
  snap.forEach(doc => {
    const p = doc.data();
    const id = doc.id;
    const html = document.createElement('div');
    html.className = 'card';
    html.innerHTML = `
      <img src="${p.image || 'images/no-img.jpg'}" alt="${p.name}" onclick="window.location='product.html?id=${id}'">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <p>Stock: ${p.stock}</p>
      <button class="btn" onclick="addToCart('${id}')">Add to Cart</button>
      <button class="btn" onclick="window.location='product.html?id=${id}'">View</button>
    `;
    productListEl.appendChild(html);
  });
}
window.addToCart = function(id) {
  const qtys = JSON.parse(localStorage.getItem('oa_cart') || '{}');
  qtys[id] = (qtys[id] || 0) + 1;
  localStorage.setItem('oa_cart', JSON.stringify(qtys));
  updateCartCount();
  alert('Added to cart');
};

loadProducts();
