const scriptURL = "https://script.google.com/macros/s/AKfycbwsYM7hU9ldj68rs_auT1Z4vvnmOXoDbZYJn3vKOA3FBP0QXRQO-1Uls8PwyOOwacPLHQ/exec";
let residentID = null;
let residentData = null;

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  residentID = params.get('id');
  if (!residentID) return;

  fetch(`${scriptURL}?query=${residentID}`)
    .then(res => res.json())
    .then(data => {
      const match = data.records.find(r => r["ID"] === residentID);
      if (match) {
        residentData = match;
        document.getElementById("resident-info").innerHTML = `
          <p><strong>ID:</strong> ${match["ID"]}</p>
          <p><strong>Name:</strong> ${match["First Name"]} ${match["Last Name"]}</p>
          <p><strong>Address:</strong> ${match["Address"] || "N/A"}</p>
          <p><strong>Contact:</strong> ${match["Contact"] || "N/A"}</p>
          <p><strong>Birthday:</strong> ${match["Birthday"]?.split("T")[0] || "N/A"}</p>
          <p><strong>Civil Status:</strong> ${match["Civil Status"] || "N/A"}</p>
        `;
      }
    });

  // Show/hide dropdowns & modal
  document.querySelectorAll('input[name="docType"]').forEach(chk => {
    chk.addEventListener('change', function() {
      if (this.value === 'Barangay Indigency') {
        document.getElementById('indigencyDropdown').classList.toggle('d-none', !this.checked);
      }
      if (this.value === 'Barangay Residency') {
        document.getElementById('residencyDropdown').classList.toggle('d-none', !this.checked);
      }
      if (this.value === 'Business Permit' && this.checked) {
        new bootstrap.Modal(document.getElementById('businessModal')).show();
      }
    });
  });

  // Submit form
  document.getElementById("request-form").addEventListener("submit", e => {
    e.preventDefault();

    // Get all checked documents
    const docs = Array.from(document.querySelectorAll('input[name="docType"]:checked'))
                      .map(el => el.value);

    if (!docs.length) {
      alert("Please select at least one document.");
      return;
    }

    // Prepare data
    let requestData = {
      ID: residentData["ID"] || "",
      "Full Name": residentData["First Name"] + " " + residentData["Last Name"],
      Address: residentData["Address"] || "",
      Type: docs.join(", "),
      "Year of Stay": residentData["Year of Stay"] || "",
      "date issued": new Date().toLocaleDateString(),
      PurposeIndigency: "",
      PuposeResidency: "",
      "Business Name": "",
      "Business Address": "",
      "Owners Name": ""
    };

    if (docs.includes("Barangay Indigency")) {
      const p = document.getElementById("indigencyPurpose").value;
      if (!p) { alert("Please select a purpose for Barangay Indigency."); return; }
      requestData.PurposeIndigency = p;
    }

    if (docs.includes("Barangay Residency")) {
      const p = document.getElementById("residencyPurpose").value;
      if (!p) { alert("Please select a purpose for Barangay Residency."); return; }
      requestData.PuposeResidency = p;
    }

    if (docs.includes("Business Permit")) {
      const bName = document.getElementById("businessName").value.trim();
      const bAddress = document.getElementById("businessAddress").value.trim();
      const oName = document.getElementById("ownerName").value.trim();
      if (!bName || !bAddress || !oName) { alert("Please complete all fields for Business Permit."); return; }
      requestData["Business Name"] = bName;
      requestData["Business Address"] = bAddress;
      requestData["Owners Name"] = oName;
    }

    // 🔹 Show loading
    document.getElementById("loadingOverlay").style.display = "flex";

    // Send data
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
    .then(() => {
      localStorage.setItem("requestedDocs", JSON.stringify(docs));
      window.location.href = "queue.html";
    })
    .catch(err => {
      console.error("Error storing request:", err);
      alert("Failed to store request. Try again.");
    })
    .finally(() => {
      document.getElementById("loadingOverlay").style.display = "none";
    });

  });
};

function goBack() {
  window.location.href = "search.html";
}
