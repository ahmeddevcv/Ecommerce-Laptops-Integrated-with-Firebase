import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
} from "../categories.js";
import * as fb from "../firebase.js";

import { protectPage } from "../auth.js";

// checkout need login
protectPage("admin");

console.log(fb.auth);
console.log(fb.auth.currentUser);

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
let categoriesLoaded = false;

// Load categories on page load
async function loadCategories() {
    if (categoriesLoaded) return;
    categoriesLoaded = true;

    categories = await getCategories();
}

// Show categories in table
window.showCategories = async function () {
    categories = await getCategories();
    const tbody = document.getElementById("categoriesTable");
    tbody.innerHTML = "";

    if (Object.keys(categories).length === 0) {
        tbody.innerHTML = `
            <tr>
              <td colspan="3" style="text-align: center; padding: 20px;">
                No categories found
              </td>
            </tr>
          `;
        return;
    }

    for (const id in categories) {
        const cat = categories[id];
        tbody.innerHTML += `
            <tr>
              <td>${id}</td>
              <td>${cat.name}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-warning" onclick="openEditModal('${id}')">Edit</button>
                  <button class="btn btn-danger" onclick="confirmDelete('${id}', '${cat.name}')">Delete</button>
                </div>
              </td>
            </tr>
          `;
    }
};

// Add new category
document
    .getElementById("categoryForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const categoryName = document.getElementById("categoryName").value;

        if (!categoryName.trim()) {
            alert("Please enter a category name");
            return;
        }

        try {
            await addCategory(categoryName);
            alert("Category added successfully");
            this.reset();
            showCategories();
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Error adding category");
        }
    });

// Edit Modal Functions
window.openEditModal = function (categoryId) {
    const category = categories[categoryId];
    if (!category) return;

    document.getElementById("editCategoryId").value = categoryId;
    document.getElementById("editCategoryName").value = category.name;

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

// Update category
document
    .getElementById("editForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const categoryId = document.getElementById("editCategoryId").value;
        const categoryName = document.getElementById("editCategoryName").value;

        if (!categoryName.trim()) {
            alert("Please enter a category name");
            return;
        }

        try {
            await updateCategory(categoryId, { name: categoryName });
            alert("Category updated successfully");
            closeModal();
            showCategories();
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Error updating category");
        }
    });

// Delete category with confirmation
window.confirmDelete = function (categoryId, categoryName) {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
        deleteCategory(categoryId)
            .then(() => {
                alert("Category deleted successfully");
                showCategories();
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
                alert("Error deleting category");
            });
    }
};

// Initialize
loadCategories();

