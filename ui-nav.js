import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// elements of nav
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userNameEl = document.getElementById("userName");
const adminLink = document.getElementById("adminLink");

// look at the state of login 
onAuthStateChanged(auth, (user) => {
  if (user) {
    // logged user
    loginBtn && (loginBtn.style.display = "none");
    logoutBtn && (logoutBtn.style.display = "inline");
    userNameEl && (userNameEl.style.display = "inline");
    userNameEl && (userNameEl.textContent = user.displayName || user.email.split("@")[0]);

    // if only admin
    // simple but I may change for safety
    // if (user.email === "admin@gmail.com") {
    //   adminLink && (adminLink.style.display = "inline");
    // }

  } else {
    // UnLogged user
    loginBtn && (loginBtn.style.display = "inline");
    logoutBtn && (logoutBtn.style.display = "none");
    userNameEl && (userNameEl.style.display = "none");
    adminLink && (adminLink.style.display = "none");
  }
});

// Logout
logoutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = "login.html";
});
