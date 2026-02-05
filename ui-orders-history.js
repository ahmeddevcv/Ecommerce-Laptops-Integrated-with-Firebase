import { protectPage } from "./auth.js";
import { auth } from "./firebase.js";
import { getProducts } from "./products.js";
import { ref, query, orderByChild, equalTo, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// https://clothesstore-57f06-default-rtdb.firebaseio.com/

protectPage();

const historyDiv = document.getElementById("ordersHistoryList");
const statusFilter = document.getElementById("statusFilter");

let allOrders = [];
let productsCache = {};

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  productsCache = await getProducts();

  const ordersQuery = query(
    ref(db, "Orders"),
    orderByChild("userId"),
    equalTo(user.uid)
  );

  // 🔴 Realtime
  onValue(ordersQuery, (snapshot) => {
    if (!snapshot.exists()) {
      historyDiv.innerHTML = "<p>No orders yet 📭</p>";
      return;
    }

    allOrders = Object.entries(snapshot.val());
    renderOrders();
  });
});

// =====================
// Render Orders with Filter
// =====================
function renderOrders() {
  historyDiv.innerHTML = "";

  const selectedStatus = statusFilter.value;

  const filteredOrders = allOrders.filter(([_, order]) => {
    if (selectedStatus === "all") return true;
    return order.status === selectedStatus;
  });

  if (filteredOrders.length === 0) {
    historyDiv.innerHTML = "<p>No orders match this filter</p>";
    return;
  }

  filteredOrders.forEach(([orderId, order], index) => {
    let totalPrice = 0;

    const itemsHTML = order.items.map(item => {
      const product = productsCache[item.productId];
      if (!product) return "";

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      return `
        <div class="order-product">
          <img src="${product.img}" class="order-img">
          <div>
            <p><strong>${product.name}</strong></p>
            <p>ID: ${item.productId}</p>
            <p>Qty: ${item.quantity}</p>
            <p>$${itemTotal}</p>
          </div>
        </div>
      `;
    }).join("");

    historyDiv.innerHTML += `
      <div class="order-item">
        <h4>Order #${index + 1}</h4>

        <p>
          Status:
          <strong class="status ${order.status}">
            ${order.status}
          </strong>
        </p>

        <p>
          Date:
          ${new Date(order.createdAt).toLocaleString()}
        </p>

        <div class="order-products">
          ${itemsHTML}
        </div>

        <h4 class="order-total">
          Total: $${totalPrice}
        </h4>
      </div>
    `;
  });
}

// =====================
// Filter change
// =====================
statusFilter.addEventListener("change", renderOrders);
