const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// Open sidebar
sidebarToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.add("active");
  sidebarToggle.style.display = "none";
  sidebarOverlay.style.display = "block";
});

// Close sidebar
sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  sidebarToggle.style.display = "block";
  sidebarOverlay.style.display = "none";
});
