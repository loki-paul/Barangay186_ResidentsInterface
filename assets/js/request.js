
function searchResident() {
  const input = document.getElementById('searchInput').value.trim();
  if (input) window.location.href = 'search.html?q=' + encodeURIComponent(input);
}

document.getElementById("searchBtn").addEventListener("click", searchResident);
document.getElementById("searchInput").addEventListener("keyup", (e) => { if(e.key==="Enter") searchResident(); });


function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
  document.getElementById('datetimeTop').innerText = now.toLocaleString('en-US', options);
}
setInterval(updateDateTime, 1000); updateDateTime();


function openRequestPage(id) {
  window.location.href = `request.html?id=${encodeURIComponent(id)}`;
}


const qrModal = document.getElementById("qrModal");
const scanQrBtn = document.getElementById("scanQrBtn");
const closeBtn = document.querySelector(".qr-close");
let html5QrCode;

scanQrBtn.addEventListener("click", () => {
  qrModal.style.display = "block";
  html5QrCode = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras().then(cameras => {
    if(cameras && cameras.length){

      let cameraId = cameras[0].id;
      for(let cam of cameras){
        if(cam.label.toLowerCase().includes("back") || cam.label.toLowerCase().includes("rear")){
          cameraId = cam.id; break;
        }
      }
      html5QrCode.start(cameraId, { fps:10, qrbox:250 },
        qrCodeMessage => {
          html5QrCode.stop().then(() => { qrModal.style.display="none"; openRequestPage(qrCodeMessage); })
                          .catch(err => console.error(err));
        },
        errorMessage => console.log("QR decode error:", errorMessage)
      ).catch(err => console.error(err));
    }
  }).catch(err => console.error(err));
});

closeBtn.addEventListener("click", () => {
  qrModal.style.display = "none";
  if(html5QrCode) html5QrCode.stop().catch(err=>console.error(err));
});

window.addEventListener("click", e => {
  if(e.target === qrModal){
    qrModal.style.display="none";
    if(html5QrCode) html5QrCode.stop().catch(err=>console.error(err));
  }
});
