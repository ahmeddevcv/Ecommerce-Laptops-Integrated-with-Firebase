import { getProducts } from "./products.js";

const grid = document.querySelector(".product-grid");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = {};

// =====================
function addToCart(productId, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.productId === productId);

  if (item) item.quantity += quantity;
  else cart.push({ productId, quantity });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}




function renderProducts(products) {
  grid.innerHTML = "";

  for (let id in products) {
    const p = products[id];

    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>

        <div class="card-actions">
          <a href="productDetails.html?id=${id}" class="btn">
            View Details
          </a>
          <button class="btn-cart" onclick="addToCart('${id}')">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }
}


// =====================
function loadCategories(products) {
  const categoriesMap = {};

  for (let id in products) {
    const cat = products[id].category;
    if (cat) categoriesMap[cat.id] = cat.name;
  }

  for (let id in categoriesMap) {
    categoryFilter.innerHTML += `
      <option value="${id}">${categoriesMap[id]}</option>
    `;
  }
}

// =====================
async function loadProducts() {
  allProducts = await getProducts();
  renderProducts(allProducts);
  loadCategories(allProducts);
}

categoryFilter.addEventListener("change", () => {
  const catId = String(categoryFilter.value).trim().toLowerCase();

 //error solved by adding trim

  if (!catId) return renderProducts(allProducts);

  const filtered = {};
  for (let id in allProducts) {
    if (String(allProducts[id].category?.id).trim().toLowerCase() === catId) {
      filtered[id] = allProducts[id];
    }
  }
  renderProducts(filtered);
});


loadProducts();
window.addToCart = addToCart;
