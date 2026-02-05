import { register, login } from "./auth.js";
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ===========================
   NAVBAR AUTH STATE
=========================== */
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userNameSpan = document.getElementById("userName");
const adminLink = document.getElementById("adminLink");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // hide login
    loginBtn && (loginBtn.style.display = "none");

    // show logout + username
    logoutBtn && (logoutBtn.style.display = "inline-block");
    userNameSpan && (userNameSpan.style.display = "inline-block");

    // get user data
    const snap = await get(ref(db, `users/${user.uid}`));
    const userData = snap.val();

    userNameSpan.textContent = userData?.name || user.email;

    // admin only
    if (userData?.role === "admin") {
      adminLink && (adminLink.style.display = "inline-block");
    }
  } else {
    // logged out
    loginBtn && (loginBtn.style.display = "inline-block");
    logoutBtn && (logoutBtn.style.display = "none");
    userNameSpan && (userNameSpan.style.display = "none");
    adminLink && (adminLink.style.display = "none");
  }
});

/* ===========================
   LOGOUT
=========================== */
logoutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = "login.html";
});

/* ===========================
   REGISTER
=========================== */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register(name, email, password);
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ===========================
   LOGIN
=========================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await login(email, password);
      window.location.href = "products.html";
    } catch (err) {
      alert(err.message);
    }
  });
}