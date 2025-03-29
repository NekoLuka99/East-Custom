// Neue script.js mit Firebase Auth & Realtime Database

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyByFfqbOOAf4nTWlzMmC9jqJHpgdBipwHQ",
  authDomain: "ls-automobile.firebaseapp.com",
  databaseURL: "https://ls-automobile-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ls-automobile",
  storageBucket: "ls-automobile.appspot.com",
  messagingSenderId: "1058858305130",
  appId: "1:1058858305130:web:7a22c1db60d39b247dac13",
  measurementId: "G-YFBF8NTHF3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const fahrzeugeRef = ref(db, "kaufbareFahrzeuge");

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = Array.from(document.querySelectorAll('.tabs button')).find(btn =>
    btn.getAttribute('onclick')?.includes(tabId)
  );
  if (activeBtn) activeBtn.classList.add('active');
}

function login() {
  const email = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("loggedInUser", userCredential.user.email);
      applyLoginUI();
      switchTab("kaufbar");
    })
    .catch((error) => {
      alert("Login fehlgeschlagen: " + error.message);
    });
}

function logout() {
  signOut(auth).then(() => {
    localStorage.removeItem("loggedInUser");
    document.body.classList.remove("logged-in");
    location.reload();
  }).catch((error) => {
    alert("Fehler beim Logout: " + error.message);
  });
}

function applyLoginUI() {
  document.querySelector(".login-area").style.display = "none";
  document.getElementById("mainTabs").style.display = "flex";
  document.getElementById("addBtn").style.display = "inline-block";
  document.getElementById("logoutBtn").style.display = "inline-block";
  document.body.classList.add("logged-in"); // FIX: Nur add
}

function renderFahrzeuge(data) {
  const grid = document.getElementById("grid-kaufbar");
  grid.innerHTML = "";

  for (const [id, vehicle] of Object.entries(data)) {
    const div = document.createElement("div");
    div.className = "category-item";
    div.setAttribute("data-price", vehicle.price);
    div.setAttribute("data-speed", vehicle.speed);
    div.setAttribute("data-weight", vehicle.weight);
    div.setAttribute("data-acceleration", vehicle.acceleration);
    div.setAttribute("data-category", vehicle.category);
    div.onclick = () => openPopup(div);

    div.innerHTML = `
      <img src="${vehicle.image}" loading="lazy" />
      <p><strong>${vehicle.name}</strong><br />Preis: ${vehicle.price}$</p>
    `;

    if (localStorage.getItem("loggedInUser")) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ Löschen";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        remove(ref(db, "kaufbareFahrzeuge/" + id));
      };
      div.appendChild(deleteBtn);
    }

    grid.appendChild(div);
  }
}

function openPopup(element) {
  document.getElementById("popupTitle").innerText = element.querySelector("strong")?.innerText || "";
  document.getElementById("popupImg").src = element.querySelector("img")?.src || "";
  document.getElementById("popupCategory").innerText = element.getAttribute("data-category") || "";
  document.getElementById("popupPrice").innerText = "Preis: " + (element.getAttribute("data-price") || "-") + "$";
  document.getElementById("specSpeed").innerText = element.getAttribute("data-speed") || "-";
  document.getElementById("specAcceleration").innerText = element.getAttribute("data-acceleration") || "-";
  document.getElementById("specWeight").innerText = element.getAttribute("data-weight") || "-";
  document.getElementById("popup").classList.add("active");
}

function closePopup() {
  document.getElementById("popup").classList.remove("active");
}

function openAddForm() {
  document.getElementById("addForm").classList.add("active");
}

function closeAddForm() {
  document.getElementById("addForm").classList.remove("active");
}

function addNewVehicle() {
  const vehicle = {
    name: document.getElementById("nameInput").value,
    price: parseInt(document.getElementById("priceInput").value),
    category: document.getElementById("categoryInput").value,
    image: document.getElementById("imageInput").value,
    speed: document.getElementById("speedInput").value,
    acceleration: document.getElementById("accelerationInput").value,
    weight: document.getElementById("weightInput").value
  };

  push(fahrzeugeRef, vehicle).then(() => {
    closeAddForm();
  });
}

window.addEventListener("load", () => {
  if (localStorage.getItem("loggedInUser")) {
    applyLoginUI();
    switchTab("kaufbar");
  } else {
    switchTab("startseite");
  }

  onValue(fahrzeugeRef, (snapshot) => {
    const data = snapshot.val() || {};
    renderFahrzeuge(data);
  });
});

// Funktionen global verfügbar machen
window.login = login;
window.logout = logout;
window.switchTab = switchTab;
window.openAddForm = openAddForm;
window.closeAddForm = closeAddForm;
window.closePopup = closePopup;
