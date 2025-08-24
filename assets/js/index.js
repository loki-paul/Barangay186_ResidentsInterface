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
