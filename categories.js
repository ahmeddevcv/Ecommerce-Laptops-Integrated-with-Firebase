import {db} from "./firebase.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Add Category
export async function addCategory(name) {
  const catRef = push(ref(db, "Categories"));

  await set(catRef, {
    name,
    // createdAt: Date.now(),
  });
}

// Get All Categories
export async function getCategories() {
  const snapshot = await get(ref(db, "Categories"));
  return snapshot.exists() ? snapshot.val() : {};
}

// Update Category
export async function updateCategory(categoryId, data) {
  await update(ref(db, `Categories/${categoryId}`), data);
}

// Delete Category
export async function deleteCategory(categoryId) {
  await remove(ref(db, `Categories/${categoryId}`));
}
