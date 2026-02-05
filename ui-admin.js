import { protectPage } from "./auth.js";
import { getOrders, updateOrderStatus, deleteOrder } from "./orders.js";

// Admin only
protectPage(["admin"]);

const list = document.getElementById("adminOrdersList");

// =====================
async function renderAdminOrders() {
  const ordersObj = await getOrders();
  const orders = Object.entries(ordersObj || {});

  list.innerHTML = "";

  if (orders.length === 0) {
    list.innerHTML = "<p>No orders yet</p>";
    renderStats({});
    return;
  }

  renderStats(ordersObj);

  orders.forEach(([id, order], index) => {
    list.innerHTML += `
      <div class="admin-order">
        <h4>Order #${index + 1}</h4>
        <p>Status: <strong>${order.status}</strong></p>
        <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>

        <div class="admin-actions">
          <button onclick="setStatus('${id}','pending')">Pending</button>
          <button onclick="setStatus('${id}','shipped')">Shipped</button>
          <button onclick="setStatus('${id}','delivered')">Delivered</button>
          <button onclick="removeOrder('${id}')" class="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    `;
  });
}

// =====================
function renderStats(ordersObj) {
  const orders = Object.values(ordersObj || []);

  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("pendingOrders").textContent =
    orders.filter(o => o.status === "pending").length;
  document.getElementById("shippedOrders").textContent =
    orders.filter(o => o.status === "shipped").length;
  document.getElementById("deliveredOrders").textContent =
    orders.filter(o => o.status === "delivered").length;
}

// =====================
window.setStatus = async (id, status) => {
  await updateOrderStatus(id, status);
  renderAdminOrders();
};

window.removeOrder = async (id) => {
  if (confirm("Delete order?")) {
    await deleteOrder(id);
    renderAdminOrders();
  }
};

renderAdminOrders();
