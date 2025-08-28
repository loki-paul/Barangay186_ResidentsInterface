const scriptURL = "https://script.google.com/macros/s/AKfycbz4OCykrmhBSEb1WHQ5497XmUGKNhq-eedT5umhNhvZgYg1623fgLygaUmXJSdBItar2g/exec";
let currentData = [];
let selectedID = null;

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (query) {
    document.getElementById('search-input').value = query;
    searchResidents();
  }
};

function searchResidents() {
  const query = document.getElementById("search-input").value.trim();
  const resultsContainer = document.getElementById("results");
  const loadingMessage = document.getElementById("loading");

  if (!query) {
    resultsContainer.innerHTML = "";
    loadingMessage.style.display = "none";
    return;
  }

  loadingMessage.style.display = "block";
  resultsContainer.innerHTML = "";

  fetch(`${scriptURL}?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      loadingMessage.style.display = "none";
      currentData = data.records || [];
      if (currentData.length > 0) {
        renderResults(currentData);
      } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch(error => {
      loadingMessage.style.display = "none";
      console.error("Error fetching data:", error);
      resultsContainer.innerHTML = "<p>Error retrieving search results. Please try again.</p>";
    });
}

function renderResults(data) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  data.forEach(record => {
    const item = document.createElement("div");
    item.classList.add("result-item");

    item.innerHTML = `
      <h5 class="mb-2">${record["First Name"]} ${record["Last Name"]} (${record["ID"]})</h5>
      <div class="btn-group">
        <button class="view-btn" onclick="openBirthdayModal('${record["ID"]}')">Edit Info</button>
        <button class="request-btn" onclick="openRequestPage('${record["ID"]}')">Request</button>
      </div>
    `;

    resultsContainer.appendChild(item);
  });
}

function sortResults() {
  const sortBy = document.getElementById("sort-select").value;
  if (!sortBy) return renderResults(currentData);

  const sorted = [...currentData];

  if (sortBy === "name") {
    sorted.sort((a, b) => {
      const nameA = (a["First Name"] + a["Last Name"]).toLowerCase();
      const nameB = (b["First Name"] + b["Last Name"]).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sortBy === "id") {
    sorted.sort((a, b) => parseInt(a["ID"]) - parseInt(b["ID"]));
  }

  renderResults(sorted);
}

function openRequestPage(id) {
  window.location.href = `request.html?id=${encodeURIComponent(id)}`;
}

function openBirthdayModal(id) {
  selectedID = id;
  document.getElementById("birthday-input").value = "";
  document.getElementById("error-message").style.display = "none";
  document.getElementById("birthday-modal").style.display = "flex";
}

function closeModal() {
  selectedID = null;
  document.getElementById("birthday-modal").style.display = "none";
}

function proceedToEdit() {
  const birthday = document.getElementById("birthday-input").value.trim();
  const error = document.getElementById("error-message");
  const format = /^\d{4}-\d{2}-\d{2}$/;

  if (!format.test(birthday)) {
    error.style.display = "block";
    return;
  }

  // ✅ For prototype, we skip actual birthday validation
  window.location.href = `editinfo.html?id=${encodeURIComponent(selectedID)}`;
}

