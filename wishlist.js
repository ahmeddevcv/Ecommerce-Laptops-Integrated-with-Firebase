import { getProductByID } from "./products.js";
import { protectPage } from "./auth.js";
// checkout need to login
protectPage();

// Load wishlist & cart
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const wishlistItemsDiv = document.getElementById("wishlistItems");

// =====================
// Render Wishlist
// =====================
async function renderWishlist() {
  wishlistItemsDiv.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItemsDiv.innerHTML = "<p>Your wishlist is empty!</p>";
    return;
  }

  for (let i = 0; i < wishlist.length; i++) {
    const productId = wishlist[i];
    const product = await getProductByID(productId);

    if (!product) continue;

    wishlistItemsDiv.innerHTML += `
      <div class="wishlist-item">
        <img src="${product.img}" alt="${product.name}">
        <div class="wishlist-item-details">
          <h4>${product.name}</h4>
          <p>Price: $${product.price}</p>
          <p>${product.description || ""}</p>
        </div>
        <div class="wishlist-actions">
          <button class="btn-remove" onclick="removeWishlistItem(${i})">
            Remove
          </button>
          <button class="btn-addtocart" onclick="moveToCart(${i})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }
}

// =====================
// Remove from wishlist
// =====================
window.removeWishlistItem = function (index) {
  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlist();
};

// =====================
// Move to cart
// =====================
window.moveToCart = function (index) {
  const productId = wishlist[index];

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  removeWishlistItem(index);

  alert("Product moved to cart!");
};

// =====================
// Clear wishlist
// =====================
window.clearWishlist = function () {
  wishlist = [];
  localStorage.removeItem("wishlist");
  renderWishlist();
};

// Initial render
renderWishlist();
