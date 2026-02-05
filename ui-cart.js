import { getProducts } from "./products.js";
import { createOrder } from "./orders.js";
import { auth } from "./firebase.js";
import { protectPage } from "./auth.js";

// checkout need login
protectPage();

const cartDiv = document.getElementById("cartItems");
const totalSpan = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearBtn = document.getElementById("clearBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = {};

// =====================
async function renderCart() {
  products = await getProducts();
  cartDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalSpan.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const p = products[item.productId];
    if (!p) return;

    const itemTotal = p.price * item.quantity;
    total += itemTotal;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="${p.img}" width="80">
        <div>
          <h4>${p.name}</h4>
          <p>Price: $${p.price}</p>
          <p>
            Qty:
            <input type="number" min="1" value="${item.quantity}"
              onchange="updateQty(${index}, this.value)">
          </p>
          <p>Total: $${itemTotal}</p>
        </div>
        <button class="btn-remove" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalSpan.textContent = total;
}

// =====================
window.updateQty = (index, qty) => {
  cart[index].quantity = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.removeItem = (index) => {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

// =====================
clearBtn.onclick = () => {
  localStorage.removeItem("cart");
  cart = [];
  renderCart();
};

// =====================
checkoutBtn.onclick = async () => {
  if (cart.length === 0) return alert("Cart is empty");

  await createOrder(auth.currentUser.uid, cart);

  localStorage.removeItem("cart");
  cart = [];

  alert("Order placed successfully 🎉");
  renderCart();
};

// =====================
renderCart();
