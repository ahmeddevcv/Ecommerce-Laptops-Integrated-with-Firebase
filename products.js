import {db} from "./firebase.js";
import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {getCategories} from "./categories.js";


// Add Product
export async function addProduct(product) {
    const productRef = push(ref(db, "Products"));

    await set(productRef, {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        categoryId: product.categoryId,
        stock: parseInt(product.stock),
        img: product.img || "https://via.placeholder.com/60",
    });
}

// Get All Products
export async function getProducts() {
    const snapshot = await get(ref(db, "Products"));
    const products = snapshot.exists() ? snapshot.val() : {};

    const categories = await getCategories();

    for (const prodId in products) {
        const product = products[prodId];
        const category = categories[product.categoryId];
        products[prodId].category = {id: product.categoryId, ...category};
    }
    return products;
}

// Get Products By Category
export async function getProductsByCategory(categoryId) {
    const q = query(
        ref(db, "Products"),
        orderByChild("categoryId"),
        equalTo(categoryId)
    );

    const snapshot = await get(q);
    return snapshot.exists() ? snapshot.val() : {};
}

// Update Product
export async function updateProduct(productId, data) {
    await update(ref(db, `Products/${productId}`), data);
}

// Delete Product
export async function deleteProduct(productId) {
    await remove(ref(db, `Products/${productId}`));
}

// Get one product by ID
export async function getProductByID(productId) {
    if (!productId) return null;

    const snap = await get(ref(db, `Products/${productId}`));
    if (!snap.exists()) {
        return null;
    }

    return {
        id: productId,
        ...snap.val(),
    };
}

