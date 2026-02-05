// Load orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];
const ordersListDiv = document.getElementById("ordersList");

// Render previous orders
function renderOrders(){
  ordersListDiv.innerHTML = "";

  if(orders.length === 0){
    ordersListDiv.innerHTML = "<p>No previous orders found!</p>";
    return;
  }

  fetch("products_data3.json")
    .then(res => res.json())
    .then(products => {
      orders.forEach((order, index) => {
        let orderHTML = `
          <div class="order-card">
            <h3>Order #${index + 1}</h3>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <div class="order-items">
              <h4>Items:</h4>
        `;

        order.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if(product){
            orderHTML += `
              <p>${product.name} - Quantity: ${item.quantity} - Price: $${product.price}</p>
            `;
          }
        });

        orderHTML += `
            </div>
            <button onclick="reorder(${index})" class="btn-reorder">Reorder</button>
        `;

        // cancel button is appeared if status is pending
        if(order.status === "Pending"){
          orderHTML += `
            <button onclick="cancelOrder(${index})" class="btn-cancel">Cancel Order</button>
          `;
        }

        orderHTML += `</div>`;
        ordersListDiv.innerHTML += orderHTML;
      });
    });
}

// Reorder function
function reorder(orderIndex){
  const order = orders[orderIndex];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  order.items.forEach(item => {
    const existingItem = cart.find(c => c.productId === item.productId);
    if(existingItem){
      existingItem.quantity += item.quantity;
    } else {
      cart.push({ productId: item.productId, quantity: item.quantity });
    }
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Order re-added to cart!");
  window.location.href = "cart.html";
}

// Cancel order function
function cancelOrder(orderIndex){
  orders[orderIndex].status = "Cancelled";
  localStorage.setItem("orders", JSON.stringify(orders));
  alert("Order cancelled successfully!");
  renderOrders();
}

// Initial render
renderOrders();