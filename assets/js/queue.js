const scriptURL = "https://script.google.com/macros/s/AKfycbxD0GmHWnM57CsN0wa-iz8Kt5gbxXT88IT0PvJoaeJB1igHy75lG9ZgzJzyKU8FpnolTA/exec";

// Fetch latest queue (or by transactionID if in URL)
fetch(scriptURL)
  .then(res => res.json())
  .then(data => {
    console.log("Backend response:", data); // Debug

    if (data.error) {
      document.getElementById("queue-number").textContent = "---";
      document.getElementById("date-time").textContent = data.error;
    } else {
      // Queue Number
      const queueNum = String(data.queueNumber || "---").padStart(3, "0");
      document.getElementById("queue-number").textContent = queueNum;

      // Prefer timestamp if available, otherwise use dateIssued
      let dateToShow = data.timestamp || data.dateIssued;
      if (dateToShow) {
        const ts = new Date(dateToShow);
        document.getElementById("date-time").textContent = ts.toLocaleString();
      } else {
        document.getElementById("date-time").textContent = "No date available";
      }

      setTimeout(() => window.print(), 800);
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    document.getElementById("queue-number").textContent = "---";
    document.getElementById("date-time").textContent = "Failed to fetch queue number";
  });

// 🔹 Load requested documents from localStorage
const docs = JSON.parse(localStorage.getItem("requestedDocs")) || [];
const docList = document.getElementById("doc-list");
docList.innerHTML = "";

if (docs.length > 0) {
  docs.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d;
    docList.appendChild(li);
  });
} else {
  docList.innerHTML = "<li>No documents</li>";
}

// 🔹 Countdown redirect
let count = 10;
const counter = document.getElementById("count");
const interval = setInterval(() => {
  count--;
  counter.textContent = count;
  if (count <= 0) {
    clearInterval(interval);
    window.location.href = "index.html";
  }
}, 1000);
