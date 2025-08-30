// Search Resident
function searchResident() {
  const input = document.getElementById('searchInput').value.trim();
  if (input) {
    window.location.href = 'search.html?q=' + encodeURIComponent(input);
  }
}

// Event listeners
document.getElementById("searchBtn").addEventListener("click", searchResident);
document.getElementById("searchInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") searchResident();
});

// Update DateTime
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit',
    hour12: true
  };
  const formatted = now.toLocaleString('en-US', options);
  document.getElementById('datetimeTop').innerText = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ✅ Open Request Page with scanned ID
function openRequestPage(id) {
  window.location.href = `request.html?id=${encodeURIComponent(id)}`;
}

let html5QrCode;

// ✅ Start QR Scanner
function startQrScanner() {
  const qrScanner = document.getElementById("qrScanner");
  qrScanner.innerHTML = ""; // clear previous scan

  html5QrCode = new Html5Qrcode("qrScanner");

  html5QrCode.start(
    { facingMode: "environment" }, // back camera
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      html5QrCode.stop().then(() => {
        closeModal();
        openRequestPage(decodedText);
      }).catch(err => console.error("Stop failed", err));
    },
    (errorMessage) => {
      // keep scanning
    }
  ).catch(err => {
    console.error("Camera start failed", err);
    alert("Unable to access camera. Please allow camera permission.");
  });
}

// ✅ Open & Close Modal
const modal = document.getElementById("qrModal");
const scanBtn = document.getElementById("scanQrBtn");
const closeBtn = document.getElementById("closeModal");

scanBtn.onclick = function () {
  modal.style.display = "block";
  startQrScanner();
}

function closeModal() {
  modal.style.display = "none";
  if (html5QrCode) {
    html5QrCode.stop().catch(err => console.error("Stop failed", err));
  }
}

closeBtn.onclick = closeModal;

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
}
