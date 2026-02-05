import {
    getPendingOrders,
    acceptOrder,
    rejectOrder,
} from "/js/ordersfb.js";
import { getProductByID } from "/js/productsfb.js";
import * as fb from "../firebase.js";

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

let orders = {};
let ordersLoaded = false;

// Show orders in table
window.showOrders = async function () {
    orders = await getPendingOrders();
    const tbody = document.getElementById("ordersTable");
    tbody.innerHTML = "";

    if (Object.keys(orders).length === 0) {
        tbody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 20px;">
                No pending orders found
              </td>
            </tr>
          `;
        return;
    }

    for (const id in orders) {
        const order = orders[id];
        const createdDate = new Date(order.createdAt).toLocaleString();
        const itemsCount = order.items ? order.items.length : 0;
        
        tbody.innerHTML += `
            <tr>
              <td>${id}</td>
              <td>${order.userId || "N/A"}</td>
              <td>${itemsCount} items</td>
              <td>${createdDate}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-primary" onclick="viewOrderDetails('${id}')">View</button>
                  <button class="btn btn-success" onclick="confirmAccept('${id}')">Accept</button>
                  <button class="btn btn-danger" onclick="confirmReject('${id}')">Reject</button>
                </div>
              </td>
            </tr>
          `;
    }
};

// View order details
window.viewOrderDetails = async function (orderId) {
    const order = orders[orderId];
    if (!order) return;

    let itemsHtml = "";
    if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
            // Try to get product details by ID if productId exists
            let productName = item.name || "Unknown Product";
            let productPrice = item.price || 0;
            
            if (item.productId) {
                const product = await getProductByID(item.productId);
                if (product) {
                    productName = product.name;
                    productPrice = product.price;
                }
            }
            
            itemsHtml += `
                <div style="padding: 5px; border-bottom: 1px solid #eee;">
                    <strong>${productName}</strong> - 
                    Qty: ${item.quantity || 1} - 
                    $${productPrice}
                </div>
            `;
        }
    }

    const detailsHtml = `
        <div style="margin-bottom: 15px;">
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>User ID:</strong> ${order.userId || "N/A"}<br>
            <strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}
        </div>
        <h4>Items:</h4>
        ${itemsHtml || "No items"}
    `;

    document.getElementById("orderDetailsContent").innerHTML = detailsHtml;
    document.getElementById("viewModal").style.display = "block";
};

// Close view modal
window.closeViewModal = function () {
    document.getElementById("viewModal").style.display = "none";
};

// Accept order
window.confirmAccept = function (orderId) {
    if (confirm("Are you sure you want to ACCEPT this order?")) {
        acceptOrder(orderId)
            .then(() => {
                alert("Order accepted successfully");
                showOrders();
            })
            .catch((error) => {
                console.error("Error accepting order:", error);
                alert("Error accepting order");
            });
    }
};

// Reject order
window.confirmReject = function (orderId) {
    if (confirm("Are you sure you want to REJECT this order?")) {
        rejectOrder(orderId)
            .then(() => {
                alert("Order rejected successfully");
                showOrders();
            })
            .catch((error) => {
                console.error("Error rejecting order:", error);
                alert("Error rejecting order");
            });
    }
};

// Close modals when clicking outside
window.onclick = function (event) {
    const viewModal = document.getElementById("viewModal");
    if (event.target === viewModal) {
        closeViewModal();
    }
};

// Initialize
showOrders();

