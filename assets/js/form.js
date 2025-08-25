const scriptURL = "https://script.google.com/macros/s/AKfycbz4OCykrmhBSEb1WHQ5497XmUGKNhq-eedT5umhNhvZgYg1623fgLygaUmXJSdBItar2g/exec";
const getIdURL = "https://script.google.com/macros/s/AKfycbwmk_AzHIsdr_QMmz8HC3evrON2ss46X9CY4nmD7T8E37WWDEQn2L70U3JTzGwQqzwM/exec"; // <-- new script for getting ID
const form = document.getElementById("barangay-form");
const submitBtn = document.getElementById("submit-btn");
const loadingMessage = document.getElementById("loading");

form.addEventListener("submit", (e) => {
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
        // ✅ Now fetch the newly added resident ID from the second script
        fetch(getIdURL)
          .then(res => res.json())
          .then(idData => {
            if (idData.status === "success") {
              const residentID = idData.residentId;

              // Show modal asking user
              const requestModal = new bootstrap.Modal(document.getElementById("requestModal"));
              requestModal.show();

              form.reset();
              document.getElementById("other_religion").style.display = "none";

              // 👉 If Yes → go to request page with ID
              document.getElementById("yesRequestBtn").onclick = () => {
                requestModal.hide();

                submitBtn.disabled = true;
                submitBtn.innerText = "Loading...";
                loadingMessage.style.display = "block";

                setTimeout(() => {
                  window.location.href = `request.html?id=${encodeURIComponent(residentID)}`;
                }, 1500);
              };

              // 👉 If No → back to index.html
              document.querySelector("#requestModal .btn-secondary").onclick = () => {
                window.location.href = "index.html";
              };

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
});
