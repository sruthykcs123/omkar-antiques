// admin.js
import firebaseConfig from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

const productSection = document.getElementById('product-section');
const pName = document.getElementById('p-name');
const pDesc = document.getElementById('p-desc');
const pPrice = document.getElementById('p-price');
const pStock = document.getElementById('p-stock');
const pImage = document.getElementById('p-image');
const saveBtn = document.getElementById('save-product');
const adminProducts = document.getElementById('admin-products');

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
  } catch (e) { alert('Login error: ' + e.message); }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    productSection.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    loadAdminProducts();
  } else {
    document.getElementById('auth-section').style.display = 'block';
    productSection.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

saveBtn.onclick = async () => {
  const file = pImage.files[0];
  let imageUrl = '';
  if (file) {
    const ref = sRef(storage, 'products/' + Date.now() + '_' + file.name);
    const snap = await uploadBytes(ref, file);
    imageUrl = await getDownloadURL(snap.ref);
  }
  const newProduct = {
    name: pName.value,
    description: pDesc.value,
    price: Number(pPrice.value),
    stock: Number(pStock.value),
    image: imageUrl,
    createdAt: serverTimestamp()
  };
  await addDoc(collection(db,'products'), newProduct);
  alert('Product saved');
  pName.value=''; pDesc.value=''; pPrice.value=''; pStock.value=''; pImage.value='';
  loadAdminProducts();
};

async function loadAdminProducts() {
  adminProducts.innerHTML = '';
  const snaps = await getDocs(collection(db,'products'));
  snaps.forEach(docSnap => {
    const p = docSnap.data();
    const id = docSnap.id;
    const div = document.createElement('div');
    div.className = 'admin-card';
    div.innerHTML = `<b>${p.name}</b> - ₹${p.price} - Stock: ${p.stock}
      <button class="btn" onclick="deleteProduct('${id}')">Delete</button>`;
    adminProducts.appendChild(div);
  });
}

window.deleteProduct = async (id) => {
  if (!confirm('Delete product?')) return;
  await deleteDoc(doc(db,'products',id));
  loadAdminProducts();
};
