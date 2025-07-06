document.addEventListener("DOMContentLoaded", () => {
  const xInput = document.getElementById("x");
  const yInput = document.getElementById("y");
  const convertBtn = document.getElementById("convertBtn");
  const resultDiv = document.getElementById("result");

  let map;
  let marker;

  function validateInputs() {
    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);

    if (isNaN(x) || isNaN(y)) {
      resultDiv.innerHTML = `<p class="error">Fyll i båda koordinaterna.</p>`;
      convertBtn.disabled = true;
      return false;
    }

    if (x < 6000000 || x > 7700000) {
      resultDiv.innerHTML = `<p class="error">X (Norring) utanför intervallet 6,000,000 - 7,700,000.</p>`;
      convertBtn.disabled = true;
      return false;
    }

    if (y < 200000 || y > 900000) {
      resultDiv.innerHTML = `<p class="error">Y (Östring) utanför intervallet 200,000 - 900,000.</p>`;
      convertBtn.disabled = true;
      return false;
    }

    resultDiv.innerHTML = "";
    convertBtn.disabled = false;
    return true;
  }

  xInput.addEventListener("input", validateInputs);
  yInput.addEventListener("input", validateInputs);

  convertBtn.addEventListener("click", () => {
    if (!validateInputs()) return;

    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);

    const sweref99tm = "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs";
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

    const [lon, lat] = proj4(sweref99tm, wgs84, [y, x]);

    resultDiv.innerHTML = `
      <p><strong>Lat:</strong> ${lat.toFixed(
        6
      )}, <strong>Lon:</strong> ${lon.toFixed(6)}</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank" rel="noopener">
        <button>Öppna i Google Maps</button>
      </a>
    `;

    if (!map) {
      map = L.map("map").setView([lat, lon], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      marker = L.marker([lat, lon]).addTo(map);
    } else {
      map.setView([lat, lon], 14);
      marker.setLatLng([lat, lon]);
    }

    setTimeout(() => map.invalidateSize(), 200);
  });
});
