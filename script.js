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
      resultDiv.classList.add("error");
      convertBtn.disabled = true;
      return false;
    }

    if (x < 6100000 || x > 7700000) {
      resultDiv.innerHTML = `<p class="error">X (Norring) utanför intervallet 6,100,000 - 7,700,000.</p>`;
      resultDiv.classList.add("error");
      convertBtn.disabled = true;
      return false;
    }

    if (y < 1200000 || y > 1650000) {
      resultDiv.innerHTML = `<p class="error">Y (Östring) utanför intervallet 1,200,000 - 1,650,000.</p>`;
      resultDiv.classList.add("error");
      convertBtn.disabled = true;
      return false;
    }

    resultDiv.innerHTML = "";
    resultDiv.classList.remove("error");
    convertBtn.disabled = false;
    return true;
  }

  xInput.addEventListener("input", validateInputs);
  yInput.addEventListener("input", validateInputs);

  convertBtn.addEventListener("click", () => {
    if (!validateInputs()) return;

    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);

    // RT90 2.5 gon V projection (EPSG:3021)
    const rt90 =
      "+proj=tmerc +lat_0=0 +lon_0=15.8062845294444 +k=1.00000561024 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs";
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

    // proj4 expects [easting, northing] = [y, x]
    const [lon, lat] = proj4(rt90, wgs84, [y, x]);

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
