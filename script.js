const kaufbareFahrzeuge = [];
renderFahrzeuge?.(bestellbareFahrzeuge, "grid-bestellbar");

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
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  if (user === "BobbyNash" && pass === "admin") {
    localStorage.setItem("loggedInUser", user); // speichern
    document.querySelector(".login-area").style.display = "none";
    document.getElementById("mainTabs").style.display = "flex";
    document.getElementById("addBtn").style.display = "inline-block";
    switchTab("kaufbar");
  } else {
    alert("Zugang verweigert");
  }
}
window.addEventListener("load", () => {
  if (localStorage.getItem("loggedInUser") === "BobbyNash") {
    applyLoginUI();
    document.getElementById("logoutBtn").style.display = "inline-block";
  }
  renderBestellfahrzeuge?.();
  renderFahrzeuge?.(kaufbareFahrzeuge, "grid-kaufbar");
  renderFahrzeuge?.(bestellbareFahrzeuge, "grid-bestellbar");
  switchTab("startseite");
});

function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload(); // Seite neu laden, um UI zurückzusetzen
}

function renderFahrzeuge() {
  const grid = document.getElementById("grid-kaufbar");
  grid.innerHTML = "";
  kaufbareFahrzeuge.forEach(vehicle => {
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
    grid.appendChild(div);
  });
}

function openPopup(element) {
  document.getElementById('popupTitle').innerText = element.querySelector('strong')?.innerText || '';
  document.getElementById('popupImg').src = element.querySelector('img')?.src || '';
  document.getElementById('popupCategory').innerText = element.getAttribute('data-category') || '';
  document.getElementById('popupPrice').innerText = 'Preis: ' + (element.getAttribute('data-price') || '-') + '$';
  document.getElementById('specSpeed').innerText = element.getAttribute('data-speed') || '-';
  document.getElementById('specAcceleration').innerText = element.getAttribute('data-acceleration') || '-';
  document.getElementById('specWeight').innerText = element.getAttribute('data-weight') || '-';
  document.getElementById('popup').classList.add('active');
}

function closePopup() {
  document.getElementById('popup').classList.remove('active');
}

function openAddForm() {
  document.getElementById('addForm').classList.add('active');
}

function closeAddForm() {
  document.getElementById('addForm').classList.remove('active');
}

function addNewVehicle() {
  const name = document.getElementById('nameInput').value;
  const price = parseInt(document.getElementById('priceInput').value);
  const image = document.getElementById('imageInput').value;
  const speed = document.getElementById('speedInput').value;
  const acceleration = document.getElementById('accelerationInput').value;
  const weight = document.getElementById('weightInput').value;

  const newVehicle = {
    name,
    price,
    category: document.getElementById("categoryInput").value,
    image,
    speed,
    weight,
    acceleration
  };

  kaufbareFahrzeuge.push(newVehicle);
  renderFahrzeuge();
  closeAddForm();
}

function applyLoginUI() {
  document.querySelector(".login-area").style.display = "none";
  document.getElementById("mainTabs").style.display = "flex";
  document.getElementById("addBtn").style.display = "inline-block";
  document.getElementById("logoutBtn").style.display = "inline-block";
}


