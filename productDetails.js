import { getProductByID } from "./products.js";

// =====================
// Get product ID from URL
// =====================
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id"); // Firebase ID (string)

// =====================
// Render product details
// =====================
async function loadProductDetails() {
  if (!productId) {
    document.getElementById("productDetails").innerHTML =
      `<p>Product not found!</p>`;
    return;
  }

  const product = await getProductByID(productId);

  if (!product) {
    document.getElementById("productDetails").innerHTML =
      `<p>Product not found!</p>`;
    return;
  }

  document.getElementById("productDetails").innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p class="price">$${product.price}</p>
    <p>${product.description || ""}</p>

    <!-- Quantity Control -->
    <div class="quantity-control">
      <button onclick="changeQuantity(-1)">-</button>
      <input type="number" id="quantity" value="1" min="1">
      <button onclick="changeQuantity(1)">+</button>
    </div>

    <button class="btn-addtocart"
      onclick="addToCartFromDetails('${product.id}')">
      Add to Cart
    </button>

    <button class="btn-wishlist"
      onclick="addToWishlist('${product.id}')">
      Add to Wishlist
    </button>
  `;
}

loadProductDetails();
// =====================
// Quantity control
// =====================
window.changeQuantity = function (amount) {
  const qtyInput = document.getElementById("quantity");
  let current = parseInt(qtyInput.value);
  current += amount;
  if (current < 1) current = 1;
  qtyInput.value = current;
};

// =====================
// Add to Cart
// =====================
window.addToCartFromDetails = function (id) {
  const qty = parseInt(document.getElementById("quantity").value);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.productId === id);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ productId: id, quantity: qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
};

// =====================
// Wishlist
// =====================
window.addToWishlist = function (id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(id)) {
    alert("Already in wishlist");
    return;
  }

  wishlist.push(id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to wishlist");
};
