import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from "./productsfb.js";
import { getCategories } from "./categoriesfb.js";
import * as fb from "../firebase.js";



// console.log(fb.auth);
// console.log(await fb.auth.currentUser.uid);

// Wait for auth to initialize before accessing currentUser
fb.auth.onAuthStateChanged((user) => {
    console.log("Auth initialized, current user:", user);
    if (user) {
        console.log("User UID:", user.uid);
    } else {
        console.log("No user logged in");
    }
});




let categories = {};
let products = {};
let categoriesLoaded = false;

// Load categories on page load
async function loadCategories() {
    if (categoriesLoaded) return;
    categoriesLoaded = true;

    categories = await getCategories();

    const addSelect = document.getElementById("categorySelect");
    const editSelect = document.getElementById("editCategorySelect");

    addSelect.innerHTML = '<option value="">Select Category</option>';
    editSelect.innerHTML = '<option value="">Select Category</option>';
    
    for (const catId in categories) {
        const cat = categories[catId];
        addSelect.innerHTML += `<option value="${catId}">${cat.name}</option>`;
        editSelect.innerHTML += `<option value="${catId}">${cat.name}</option>`;
    }
}

// Show products in table
window.showProducts = async function () {
    products = await getProducts();
    const tbody = document.getElementById("productsTable");
    tbody.innerHTML = "";

    if (Object.keys(products).length === 0) {
        tbody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 20px;">
                No products found
              </td>
            </tr>
          `;
        return;
    }

    for (const id in products) {
        const p = products[id];
        tbody.innerHTML += `
            <tr>
              <td>
                <img src="${p.img || "https://via.placeholder.com/60"}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60'">
              </td>
              <td>${p.name}</td>
              <td>${p.price}</td>
              <td>${p.category?.name || "Unspecified"}</td>
              <td>${p.stock}</td>
              <td>${p.description || "-"}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-warning" onclick="openEditModal('${id}')">Edit</button>
                  <button class="btn btn-danger" onclick="confirmDelete('${id}', '${p.name}')">Delete</button>
                </div>
              </td>
            </tr>
          `;
    }
};

// Add new product
document
    .getElementById("productForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const productData = {
            name: document.getElementById("productName").value,
            price: document.getElementById("productPrice").value,
            categoryId: document.getElementById("categorySelect").value,
            stock: document.getElementById("productStock").value,
            description: document.getElementById("productDescription").value,
            img: "https://via.placeholder.com/60",
        };

        if (!productData.categoryId) {
            alert("Please select a category");
            return;
        }

        try {
            await addProduct(productData);
            alert("Product added successfully");
            this.reset();
            showProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Error adding product");
        }
    });

// Edit Modal Functions
window.openEditModal = function (productId) {
    const product = products[productId];
    if (!product) return;

    document.getElementById("editProductId").value = productId;
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editCategorySelect").value = product.categoryId;
    document.getElementById("editProductStock").value = product.stock;
    document.getElementById("editProductDescription").value =
        product.description || "";

    document.getElementById("editModal").style.display = "block";
};

window.closeModal = function () {
    document.getElementById("editModal").style.display = "none";
};

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        closeModal();
    }
};

// Update product
document
    .getElementById("editForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const productId = document.getElementById("editProductId").value;
        const updateData = {
            name: document.getElementById("editProductName").value,
            price: parseFloat(
                document.getElementById("editProductPrice").value,
            ),
            categoryId: document.getElementById("editCategorySelect").value,
            stock: parseInt(document.getElementById("editProductStock").value),
            description: document.getElementById("editProductDescription")
                .value,
        };

        if (!updateData.categoryId) {
            alert("Please select a category");
            return;
        }

        try {
            await updateProduct(productId, updateData);
            alert("Product updated successfully");
            closeModal();
            showProducts();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product");
        }
    });

// Delete product with confirmation
window.confirmDelete = function (productId, productName) {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
        deleteProduct(productId)
            .then(() => {
                alert("Product deleted successfully");
                showProducts();
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                alert("Error deleting product");
            });
    }
};

// Initialize
loadCategories();
