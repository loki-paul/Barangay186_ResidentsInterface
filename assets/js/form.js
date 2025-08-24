const scriptURL = "https://script.google.com/macros/s/AKfycbzVREmQ5BtvLXBz3BLxb3dE9J1p2PDttyBmzAXdcfJi99ugs2AnZBr3p6HOOd3L5nPNew/exec";
const form = document.getElementById("barangay-form");
const submitBtn = document.getElementById("submit-btn");
const loadingMessage = document.getElementById("loading");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";
  loadingMessage.style.display = "block";

  const formData = new FormData(form);

  fetch(scriptURL, { method: "POST", body: formData })
    .then(response => response.text())
    .then(text => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("JSON Parse Error:", err, text);
        alert("An error occurred. Please try again.");
        return;
      }
      if (data.status === "success") {
        alert("Form submitted successfully!");
        form.reset();
        document.getElementById("other_religion").style.display = "none";
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => console.error("Error!", error.message))
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      loadingMessage.style.display = "none";
    });
});

function toggleOtherReligion(select) {
  const otherField = document.getElementById("other_religion");
  otherField.style.display = select.value === "Others" ? "block" : "none";
  
}

// Handle "No Middle Name" checkbox
const noMiddleNameCheckbox = document.getElementById("noMiddleName");
const middleNameInput = document.getElementById("middlename");

noMiddleNameCheckbox.addEventListener("change", function () {
  if (this.checked) {
    middleNameInput.value = "N/A";   // Or leave it empty if you prefer ""
    middleNameInput.disabled = true; // Prevent typing
    middleNameInput.removeAttribute("required"); // Not required anymore
  } else {
    middleNameInput.value = "";
    middleNameInput.disabled = false;
    middleNameInput.setAttribute("required", "true");
  }
});