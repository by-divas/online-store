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

function makeOrderId() {
  // Generate like: DIVAS-0401-K9F2
  const today = new Date();
  
  // Gets MM/DD format
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${month}${day}`;
  
  // Generates 4 random alphanumeric characters
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `DIVAS-${dateStr}-${randomStr}`;
}

// Paste your copied Web App URL here
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwSXgXjRS7P0UeMgzTnkj4m50SDS3dwF8QcSMBelAq1BmplxaeKPzw0KAks9Lj48lygMw/exec";

function checkout() {
  if (cart.length < 1) return alert("Keranjang masih kosong!");
  
  const name = document.getElementById("buyerName").value;
  const custPhone = document.getElementById("buyerNumber").value;
  const adress = document.getElementById("buyerAddress").value;
  const payment = document.getElementById("paymentMethod").value;
  const note = document.getElementById("buyerNote").value;
  
  if (!name || !payment) {
    return alert("Harap isi Nama dan Metode Pembayaran ya.");
  }

  const orderId = makeOrderId(); // Called properly with parentheses
  const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  
  // Create a readable string of items for the sheet
  const itemsSummary = cart.map(item => `${item.name} (x${item.qty})`).join(", ");

  // 1. Send the data to Google Sheets
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors", // Required to avoid CORS blocks with Google Web Apps
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderId: orderId,
      name: name,
      phone: custPhone,
      address: adress,
      payment: payment,
      items: itemsSummary,
      total: total,
      note: note
    })
  }).then(() => {
    console.log("Order recorded in Google Sheets!");
  }).catch(err => {
    console.error("Failed to record order:", err);
  });

  // 2. Build the WhatsApp text and open it
  let text = `*DIVAS SNACK AND PASTRIES*%0A`;
  text += `--------------------------%0A`;
  text += `*Nama:* ${name}%0A`;
  text += `*Nomor Handphone:* ${custPhone}%0A`;
  text += `*Alamat:* ${adress}%0A`;
  text += `*Metode:* ${payment}%0A%0A`;
  text += `*Daftar Pesanan:*%0A`;
  
  cart.forEach(item => {
    text += `• ${item.name} (x${item.qty})%0A`;
  });

  text += `--------------------------%0A`;
  text += `%0A*Total Bayar: Rp ${total.toLocaleString('id-ID')}*%0A`;
  
  if (note.trim() !== "") {
    text += `--------------------------%0A`;
    text += `*Catatan:* ${note}%0A`;
  }

  text += `--------------------------%0A`;
  text += `JANGAN HAPUS TEKS DIBAWAH⚠️‼️%0A`;
  text += `${orderId}`; // Used the generated ID
  
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}
