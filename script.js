let map;
let marker;

document.getElementById("convertBtn").addEventListener("click", function () {
  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);

  if (isNaN(x) || isNaN(y)) {
    alert("Mata in giltiga koordinater för X och Y.");
    return;
  }

  // Definiera SWEREF och WGS84
  const sweref99tm = "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs";
  const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

  // Transformera
  const [lon, lat] = proj4(sweref99tm, wgs84, [y, x]);

  // Visa resultat
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <p>Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}</p>
    <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}"
       target="_blank">
      <button>Öppna i Google Maps</button>
    </a>
  `;

  // Rita kartan
  if (!map) {
    map = L.map("map").setView([lat, lon], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 14);
    marker.setLatLng([lat, lon]);
  }
});
