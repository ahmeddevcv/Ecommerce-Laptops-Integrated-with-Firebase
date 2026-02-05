import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export async function register(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(db, `users/${cred.user.uid}`), {
    name,
    email,
    role: "user",
  });
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function isAdmin() {
  const snap = await get(ref(db, `users/${auth.currentUser.uid}`));
  const user = snap.val();

  return user.role === "admin";
}

export function protectPage(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return (location.href = "login.html");

    if (allowedRoles.length === 0) return;

    const snap = await get(ref(db, `users/${user.uid}/role`));
    if (!allowedRoles.includes(snap.val())) {
      location.href = "unauthorized.html";
    }
  });
}
