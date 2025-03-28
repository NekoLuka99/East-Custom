
// script.js

const vehicles = [
  {
    name: "Pegassi Bati 801",
    category: "sportbikes",
    price: 15000,
    image: "https://static.wikia.nocookie.net/gtawiki/images/d/d9/Bati801-GTAV-front.png/revision/latest?cb=20160127211358",
    speed: "320 km/h",
    weight: "210 kg",
    acceleration: "2.8 s"
  },
  {
    name: "Shitzu Hakuchou Drag",
    category: "sportbikes",
    price: 20000,
    image: "https://static.wikia.nocookie.net/gtawiki/images/a/ab/Hakuchou-GTAV-front.png/revision/latest?cb=20160302173513",
    speed: "310 km/h",
    weight: "220 kg",
    acceleration: "2.6 s"
  },
  {
    name: "Nagasaki Shotaro",
    category: "sportbikes",
    price: 22000,
    image: "https://static.wikia.nocookie.net/gtawiki/images/e/e4/Shotaro-GTAO.png",
    speed: "330 km/h",
    weight: "200 kg",
    acceleration: "2.4 s"
  }
  // Weitere Fahrzeuge hier einfügen
];

function generateVehicleCards() {
  const containerMap = {};
  document.querySelectorAll('.subcategory').forEach(section => {
    const category = section.querySelector('h2').innerText.toLowerCase();
    containerMap[category] = section.querySelector('.category-grid');
  });

  vehicles.forEach(vehicle => {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.setAttribute('data-category', vehicle.category);
    div.setAttribute('data-price', vehicle.price);
    div.setAttribute('data-speed', vehicle.speed);
    div.setAttribute('data-weight', vehicle.weight);
    div.setAttribute('data-acceleration', vehicle.acceleration);
    div.onclick = function () { openPopup(this); };

    div.innerHTML = `
      <img src="${vehicle.image}" loading="lazy" />
      <p>
        <strong>${vehicle.name}</strong><br />
        High-Performance Motorrad.<br />
        <strong>Preis:</strong> ${vehicle.price}$
      </p>
    `;

    const categoryGrid = containerMap[vehicle.category];
    if (categoryGrid) categoryGrid.appendChild(div);
  });
}

function searchVehicles() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;
  const allSections = document.querySelectorAll('.subcategory');

  allSections.forEach(section => {
    let hasVisibleItems = false;
    const items = section.querySelectorAll('.category-item');

    items.forEach(item => {
      const title = item.querySelector('strong')?.innerText.toLowerCase() || '';
      const description = item.innerText.toLowerCase();
      const category = item.getAttribute('data-category');

      const matchesSearch = title.includes(searchInput) || description.includes(searchInput);
      const matchesCategory =
        selectedCategory === 'all' || selectedCategory === category || selectedCategory === '';

      const shouldShow = (!searchInput && matchesCategory) || (matchesSearch && matchesCategory);

      item.style.display = shouldShow ? 'flex' : 'none';
      if (shouldShow) hasVisibleItems = true;
    });

    section.style.display = hasVisibleItems ? 'block' : 'none';
  });
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.querySelectorAll('.subcategory').forEach(section => {
    section.style.display = 'none';
    section.querySelectorAll('.category-item').forEach(item => {
      item.style.display = 'none';
    });
  });
}

function openPopup(element) {
  const title = element.querySelector('strong')?.innerText || '';
  const imgSrc = element.querySelector('img')?.src || '';

  const speed = element.getAttribute('data-speed') || '–';
  const weight = element.getAttribute('data-weight') || '–';
  const acceleration = element.getAttribute('data-acceleration') || '–';
  const category = element.getAttribute('data-category') || '';
  const price = element.getAttribute('data-price') || '';

  document.getElementById('popupTitle').innerText = title;
  document.getElementById('popupImg').src = imgSrc;
  document.getElementById('popupCategory').innerText = category;
  document.getElementById('popupPrice').innerText = `Preis: ${price}$`;
  document.getElementById('specSpeed').innerText = speed;
  document.getElementById('specAcceleration').innerText = acceleration;
  document.getElementById('specWeight').innerText = weight;

  document.getElementById('popup').classList.add('active');
}

function closePopup() {
  document.getElementById('popup').classList.remove('active');
}

window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  header.classList.toggle('shrink', window.scrollY > 50);
});

window.addEventListener('load', () => {
  generateVehicleCards();
  searchVehicles();
});
