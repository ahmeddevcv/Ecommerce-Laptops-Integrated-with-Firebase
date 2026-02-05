import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeP9jvu33-e-fayikgFCpVKIngP3XIn7M",
  authDomain: "clothesstore-57f06.firebaseapp.com",
  databaseURL: "https://clothesstore-57f06-default-rtdb.firebaseio.com",
  projectId: "clothesstore-57f06",
  storageBucket: "clothesstore-57f06.firebasestorage.app",
  messagingSenderId: "559187584236",
  appId: "1:559187584236:web:72af9937733be6d012f1c9"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// new
import { getStorage } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

export const storage = getStorage(app);