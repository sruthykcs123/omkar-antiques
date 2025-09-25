// product.js
import firebaseConfig from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(location.search);
const id = params.get('id');

const prodImg = document.getElementById('prod-img');
const prodName = document.getElementById('prod-name');
const prodDesc = document.getElementById('prod-desc');
const prodPrice = document.getElementById('prod-price');
const prodStock = document.getElementById('prod-stock');
const qtyInput = document.getElementById('qty');
const addBtn = document.getElementById('add-cart');
const buyBtn = document.getElementById('buy-now');

async function load() {
  if (!id) { document.body.innerHTML = '<p>Product not found</p>'; return; }
  const docRef = doc(db,'products', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) { document.body.innerHTML = '<p>Product not found</p>'; return; }
  const p = snap.data();
  prodImg.src = p.image || 'images/no-img.jpg';
  prodName.innerText = p.name;
  prodDesc.innerText = p.description;
  prodPrice.innerText = '₹' + p.price;
  prodStock.innerText = p.stock;
}
load();

addBtn.onclick = () => {
  const qty = parseInt(qtyInput.value) || 1;
  const current = JSON.parse(localStorage.getItem('oa_cart') || '{}');
  current[id] = (current[id] || 0) + qty;
  localStorage.setItem('oa_cart', JSON.stringify(current));
  alert('Added to cart');
  window.location = 'cart.html';
};

buyBtn.onclick = async () => {
  const qty = parseInt(qtyInput.value) || 1;
  localStorage.setItem('oa_cart', JSON.stringify({ [id]: qty }));
  window.location = 'cart.html';
};
