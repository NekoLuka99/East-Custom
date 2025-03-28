const kaufbareFahrzeuge = [
  {
    name: "Pegassi Bati 801",
    price: 15000,
    category: "sportbike",
    image: "https://static.wikia.nocookie.net/gtawiki/images/d/d9/Bati801-GTAV-front.png/revision/latest?cb=20160127211358",
    speed: "320 km/h",
    weight: "210 kg",
    acceleration: "2.8 s"
  }
];

const bestellbareFahrzeuge = [
  {
    name: "Western Zombie Chopper",
    price: 13500,
    category: "chopper",
    image: "https://static.wikia.nocookie.net/gtawiki/images/6/64/Hexer-GTAV-front.png/revision/latest?cb=20160211212015",
    speed: "290 km/h",
    weight: "250 kg",
    acceleration: "3.2 s"
  }
];

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.tabs button'))
    .find(btn => btn.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');
}

function renderFahrzeuge(fahrzeugeArray, targetGridId) {
  const grid = document.getElementById(targetGridId);
  grid.innerHTML = "";

  fahrzeugeArray.forEach(vehicle => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.setAttribute("data-price", vehicle.price);
    div.setAttribute("data-speed", vehicle.speed);
    div.setAttribute("data-weight", vehicle.weight);
    div.setAttribute("data-acceleration", vehicle.acceleration);
    div.setAttribute("data-category", vehicle.category);
    div.onclick = () => openPopup(div);

    div.innerHTML = \`
      <img src="\${vehicle.image}" loading="lazy" />
      <p>
        <strong>\${vehicle.name}</strong><br />
        <strong>Preis:</strong> \${vehicle.price}$
      </p>
    \`;
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

window.addEventListener("load", () => {
  renderFahrzeuge(kaufbareFahrzeuge, "grid-kaufbar");
  renderFahrzeuge(bestellbareFahrzeuge, "grid-bestellbar");
  switchTab("kaufbar");
});
