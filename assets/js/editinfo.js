const scriptURL = "https://script.google.com/macros/s/AKfycbwsYM7hU9ldj68rs_auT1Z4vvnmOXoDbZYJn3vKOA3FBP0QXRQO-1Uls8PwyOOwacPLHQ/exec";

// Get resident ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const residentID = urlParams.get('id');

// Fetch resident data on page load
if (residentID) {
  fetchResidentData(residentID);
} else {
  alert("No Resident ID provided!");
}

function fetchResidentData(id) {
  const loadingElem = document.getElementById("loading");
  loadingElem.style.display = "block";
  fetch(`${scriptURL}?query=${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(data => {
      loadingElem.style.display = "none";
      if (data.records && data.records.length > 0) {
        const resident = data.records[0];
        document.getElementById("id").value = resident["ID"];
        document.getElementById("firstname").value = resident["First Name"] || "";
        document.getElementById("middlename").value = resident["Middle Name"] || "";
        document.getElementById("lastname").value = resident["Last Name"] || "";
        document.getElementById("suffix").value = resident["Suffix"] || "";
        document.getElementById("birthday").value = resident["Birthday"] ? resident["Birthday"].split("T")[0] : "";
        document.getElementById("complete_address").value = resident["Complete Address"] || resident["Address"] || "";
        document.getElementById("contact").value = resident["Contact"] || "";
        document.getElementById("sex").value = resident["Sex"] || "";
        document.getElementById("birthplace").value = resident["Birthplace"] || "";
        document.getElementById("civilstatus").value = resident["Civil Status"] || "";
        document.getElementById("religion").value = resident["Religion"] || "";
        document.getElementById("yearofstay").value = resident["Year of Stay"] || "";
        document.getElementById("citizenship").value = resident["Citizenship"] || "";
      } else {
        alert("Resident not found!");
      }
    })
    .catch(error => {
      document.getElementById("loading").style.display = "none";
      alert("Error fetching resident data: " + error);
    });
}

// Show modal instead of alert on form submit
document.getElementById("edit-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const modal = document.getElementById("submitted-modal");
  modal.style.display = "flex";
});

// Modal OK button closes modal
document.getElementById("modal-ok-btn").addEventListener("click", function() {
  document.getElementById("submitted-modal").style.display = "none";
});

// Back button navigates back
document.getElementById("back-btn").addEventListener("click", function() {
  window.history.back();
});

