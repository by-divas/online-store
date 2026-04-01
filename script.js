let cart = [];
const phone = "6285161200956"; 

function addToCart(name, price) {
  let item = cart.find(x => x.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  
  // Efek feedback kecil
  const cartBtn = document.getElementById("cartButton");
  cartBtn.style.transform = "scale(1.2)";
  setTimeout(() => cartBtn.style.transform = "scale(1)", 200);
}

function updateCartUI() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  document.getElementById("cartCount").innerText = count;
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  const overlay = document.getElementById("modalOverlay");
  modal.classList.toggle("active");
  overlay.classList.toggle("active");
  
  if (modal.classList.contains("active")) {
    renderCart();
  }
}

function renderCart() {
  const list = document.getElementById("cartItems");
  let total = 0;
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<p style='text-align:center; color:#999;'>Keranjang kosong nih.. </p>";
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    list.innerHTML += `
      <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:15px; border: 1px dashed #ddd;">
        <div>
          <strong style="display:block">${item.name}</strong>
          <small>${item.qty} x Rp ${item.price.toLocaleString('id-ID')}</small>
        </div>
        <button style="background:#ff4d4d; color:white; border:none; padding:5px 12px; border-radius:10px; cursor:pointer; font-size:12px;" onclick="removeItem('${item.name}')">Hapus</button>
      </li>`;
  });

  document.getElementById("totalPrice").innerText = total.toLocaleString('id-ID');
}

function removeItem(name) {
  cart = cart.filter(x => x.name !== name);
  updateCartUI();
  renderCart();
}

function checkout() {
  if (cart.length < 1) return alert("Keranjang masih kosong!");
  
  const name = document.getElementById("buyerName").value;
  const payment = document.getElementById("paymentMethod").value;
  const note = document.getElementById("buyerNote").value;
  
  if (!name || !payment) {
    return alert("Harap isi Nama dan Metode Pembayaran ya.");
  }
  
  let text = `*DIVAS SNACK AND PASTRIES*%0A`;
  text += `--------------------------%0A`;
  text += `*Nama:* ${name}%0A`;
  text += `*Metode:* ${payment}%0A%0A`;
  text += `*Daftar Pesanan:*%0A`;
  
  cart.forEach(item => {
    text += `• ${item.name} (x${item.qty})%0A`;
  });
  
  const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  text += `%0A*Total Bayar: Rp ${total.toLocaleString('id-ID')}*%0A`;
  
  if (note.trim() !== "") {
    text += `--------------------------%0A`;
    text += `*Catatan:* ${note}%0A`;
  }

  
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}
