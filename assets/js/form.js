const scriptURL = "https://script.google.com/macros/s/AKfycbz4OCykrmhBSEb1WHQ5497XmUGKNhq-eedT5umhNhvZgYg1623fgLygaUmXJSdBItar2g/exec";
const getIdURL = "https://script.google.com/macros/s/AKfycbwmk_AzHIsdr_QMmz8HC3evrON2ss46X9CY4nmD7T8E37WWDEQn2L70U3JTzGwQqzwM/exec";
const form = document.getElementById("barangay-form");
const submitBtn = document.getElementById("submit-btn");
const loadingMessage = document.getElementById("loading");

const contactInput = document.getElementById("contactnumber");
const contactFeedback = document.getElementById("contactFeedback");

// Validate Contact Number
contactInput.addEventListener("input", () => {
  const value = contactInput.value;
  const valid = /^09\d{9}$/.test(value); // Must start with 09 and be 11 digits

  if (valid) {
    contactInput.classList.remove("is-invalid");
    contactInput.classList.add("is-valid");
  } else {
    contactInput.classList.remove("is-valid");
    contactInput.classList.add("is-invalid");
  }
});

// Submit Form (core logic)
function handleFormSubmit(e) {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";
  loadingMessage.style.display = "block";

  const formData = new FormData(form);

  // First, submit the form data
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

        // Fetch the newly added resident ID
        fetch(getIdURL)
          .then(res => res.json())
          .then(idData => {
            if (idData.status === "success") {
              const residentID = idData.residentId;

              // Show Success + QR Modal
              document.getElementById("residentIdDisplay").textContent = residentID;

              const qrContainer = document.getElementById("qrcode");
              qrContainer.innerHTML = ""; // clear old QR

              // Generate QR
              new QRCode(qrContainer, {
                text: residentID,
                width: 150,
                height: 150
              });

              // Save QR Code when "Yes" is clicked
              document.getElementById("yesPrintBtn").onclick = () => {
                const qrImg = qrContainer.querySelector("img");
                const qrCanvas = qrContainer.querySelector("canvas");

                let dataURL = "";

                if (qrImg && qrImg.src) {
                  dataURL = qrImg.src;
                } else if (qrCanvas) {
                  dataURL = qrCanvas.toDataURL("image/png");
                }

                if (dataURL) {
                  const link = document.createElement("a");
                  link.href = dataURL;
                  link.download = `ResidentQR_${residentID}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  alert("QR Code not found!");
                }
              };


              const successModal = new bootstrap.Modal(document.getElementById("successModal"));
              successModal.show();

              // Print option
              document.getElementById("yesPrintBtn").onclick = () => {
                const qrImg = qrContainer.querySelector("img");
                const qrCanvas = qrContainer.querySelector("canvas");

                let dataURL = "";

                if (qrImg && qrImg.src) {
                  // If QR is generated as an <img>
                  dataURL = qrImg.src;
                } else if (qrCanvas) {
                  // If QR is generated as a <canvas>
                  dataURL = qrCanvas.toDataURL("image/png");
                }

                if (dataURL) {
                  const link = document.createElement("a");
                  link.href = dataURL;
                  link.download = `ResidentQR_${residentID}.png`; // filename
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  alert("QR Code not found!");
                }
              };


              // No print → show Request Modal
              document.getElementById("noPrintBtn").onclick = () => {
                successModal.hide();
                const requestModal = new bootstrap.Modal(document.getElementById("requestModal"));
                requestModal.show();

                // Yes → go to request page
                document.getElementById("yesRequestBtn").onclick = () => {
                  requestModal.hide();
                  window.location.href = `request.html?id=${encodeURIComponent(residentID)}`;
                };

                // No → back to index
                document.querySelector("#requestModal .btn-secondary").onclick = () => {
                  window.location.href = "index.html";
                };
              };

              // Reset form
              form.reset();
              document.getElementById("other_religion").style.display = "none";
              contactInput.classList.remove("is-valid", "is-invalid");

            } else {
              alert("Error getting resident ID: " + idData.message);
            }
          })
          .catch(err => console.error("Error fetching ID:", err));

      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => console.error("Error submitting form!", error))
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      loadingMessage.style.display = "none";
    });
}

// Handle "Other Religion"
function toggleOtherReligion(select) {
  const otherField = document.getElementById("other_religion");
  if (select.value === "Others") {
    otherField.style.display = "block";
    otherField.required = true;
  } else {
    otherField.style.display = "none";
    otherField.required = false;
    otherField.value = ""; // clear leftover text
  }
}

// Handle "No Middle Name" checkbox
const noMiddleNameCheckbox = document.getElementById("noMiddleName");
const middleNameInput = document.getElementById("middlename");

noMiddleNameCheckbox.addEventListener("change", function () {
  if (this.checked) {
    middleNameInput.value = "N/A";
    middleNameInput.disabled = true;
    middleNameInput.removeAttribute("required");
  } else {
    middleNameInput.value = "";
    middleNameInput.disabled = false;
    middleNameInput.setAttribute("required", "true");
  }
});

// Terms & Conditions flow
const termsModal = new bootstrap.Modal(document.getElementById("termsModal"));
const acceptTermsBtn = document.getElementById("acceptTermsBtn");

let formSubmitPending = false;

// Intercept Submit
form.addEventListener("submit", (e) => {
  if (!formSubmitPending) {
    e.preventDefault(); // stop normal submit
    termsModal.show();
  } else {
    handleFormSubmit(e); // proceed with real submit
  }
});

// When user accepts terms → actually submit form
acceptTermsBtn.addEventListener("click", () => {
  termsModal.hide();
  formSubmitPending = true;
  form.requestSubmit(); // re-trigger form submit
  formSubmitPending = false;
});

// Global fix: Blur focused buttons in modals before hiding (to avoid aria-hidden warning)
document.addEventListener("click", (e) => {
  if (e.target.closest(".modal") && e.target.tagName === "BUTTON") {
    e.target.blur();
  }
});
