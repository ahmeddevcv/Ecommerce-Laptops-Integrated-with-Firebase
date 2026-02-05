import { db } from "../firebase.js";
import {
  ref,
  push,
  set,
  get,
  update,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Create Order (User)
export async function createOrder(userId, items) {
  const orderRef = push(ref(db, "Orders"));

  await set(orderRef, {
    userId,
    status: "pending",
    createdAt: Date.now(),
    items, // auth.currentUser.uid
  });
  return orderRef.key;
}

// Get Pending Orders (Admin)
export async function getPendingOrders() {
  const q = query(
    ref(db, "Orders"),
    orderByChild("status"),
    equalTo("pending"),
  );

  const snapshot = await get(q);
  return snapshot.exists() ? snapshot.val() : {};
}

// Accept Order
export async function acceptOrder(orderId) {
  await update(ref(db, `Orders/${orderId}`), {
    status: "accepted",
    updatedAt: Date.now(),
  });
}

// Reject Order
export async function rejectOrder(orderId) {
  await update(ref(db, `Orders/${orderId}`), {
    status: "rejected",
    updatedAt: Date.now(),
  });
}

// get currentUser orders
export async function getMyPreviousOrders(userId) {
  const q = query(ref(db, "Orders"), orderByChild("userId"), equalTo(userId));

  const snapshot = await get(q);

  if (!snapshot.exists()) return {};

  return snapshot.val();
}

// Rating (one user - one product)
export async function rateProduct(productId, userId, rate) {
  await set(ref(db, `Ratings/${productId}/${userId}`), rate);
}
