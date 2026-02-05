import { db } from "./firebase.js";
import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// =====================
// Create Order
// =====================
export async function createOrder(userId, items) {
  const orderRef = push(ref(db, "Orders"));

  await set(orderRef, {
    userId,
    status: "pending",
    createdAt: Date.now(),
    items,
  });

  return orderRef.key;
}

// =====================
// Orders by user (History)
// =====================
export async function getOrdersByUser(userId) {
  const q = query(
    ref(db, "Orders"),
    orderByChild("userId"),
    equalTo(userId)
  );

  const snapshot = await get(q);
  return snapshot.exists() ? snapshot.val() : {};
}

// =====================
// Cancel order (User)
// =====================
export async function cancelOrder(orderId) {
  await update(ref(db, `Orders/${orderId}`), {
    status: "cancelled",
    updatedAt: Date.now(),
  });
}

// =====================
// Admin
// =====================
export async function getAllOrders() {
  const snap = await get(ref(db, "Orders"));
  return snap.exists() ? snap.val() : {};
}

export async function updateOrderStatus(orderId, status) {
  await update(ref(db, `Orders/${orderId}`), {
    status,
    updatedAt: Date.now(),
  });
}

export async function deleteOrder(orderId) {
  await remove(ref(db, `Orders/${orderId}`));
}
// =====================
// Delete Order (User allowed if NOT accepted)
// =====================
export async function deleteOrderByUser(orderId) {
  await remove(ref(db, `Orders/${orderId}`));
}

