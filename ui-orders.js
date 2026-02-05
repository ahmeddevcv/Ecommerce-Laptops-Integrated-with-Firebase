import { protectPage } from "./auth.js";
import { auth } from "./firebase.js";
import { getOrdersByUser, cancelOrder, deleteOrderByUser } from "./orders.js";
import { getProducts } from "./products.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

protectPage();

const ordersListDiv = document.getElementById("ordersList");

// =====================
// Listen for Auth
// =====================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const ordersObj = await getOrdersByUser(user.uid);
  // const orders = Object.entries(ordersObj || {});
  const statusOrder = {
  accepted: 1,
  pending: 2,
  cancelled: 3,
  rejected: 4,
};

const orders = Object.entries(ordersObj || {}).sort(
  ([, a], [, b]) =>
    (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
);

  const products = await getProducts(); // {id: {...}}

  ordersListDiv.innerHTML = "";

  if (orders.length === 0) {
    ordersListDiv.innerHTML = "<p>You have no orders yet 📭</p>";
    return;
  }

  orders.forEach(([orderId, order], index) => {
    ordersListDiv.innerHTML += `
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
  ${order.items.map(item => {
    const product = products[item.productId];
    return `
      <div class="order-product">
        <img src="${product?.img || 'https://via.placeholder.com/60'}"
             alt="${product?.name || 'Product'}">

        <div class="order-product-info">
          <h5>${product?.name || "Unknown Product"}</h5>
          <small>ID: ${item.productId}</small>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: $${product?.price || 0}</p>
        </div>
      </div>
    `;
  }).join("")}
</div>


        <div class="order-actions">

  ${
    order.status === "pending"
      ? `<button class="btn-cancel"
           onclick="cancelMyOrder('${orderId}')">
           Cancel
         </button>`
      : ""
  }

  ${
    order.status !== "accepted"
      ? `<button class="btn-delete"
           onclick="deleteMyOrder('${orderId}')">
           Delete
         </button>`
      : ""
  }

</div>

      </div>
    `;
  });
});

// =====================
// Cancel Order (exposed)
// =====================
window.cancelMyOrder = async function (orderId) {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  await cancelOrder(orderId);
  alert("Order cancelled successfully ❌");
  location.reload();
};
// =====================
// Delete Order (User)
// =====================
window.deleteMyOrder = async function (orderId) {
  if (!confirm("Delete this order permanently?")) return;

  await deleteOrderByUser(orderId);

  document
    .querySelector(`[data-order-id="${orderId}"]`)
    ?.remove();

  alert("Order deleted 🗑️");
};
