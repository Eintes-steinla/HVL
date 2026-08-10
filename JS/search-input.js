const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const searchRecents = document.getElementById("search-recents");

function showInput() {
  searchRecents.classList.add("hidden");

  searchIcon.classList.add("hidden");
  searchInput.classList.remove("hidden", "opacity-0");
  requestAnimationFrame(() => {
    searchInput.classList.add("w-[180px]");
    searchInput.classList.remove("w-[2px]");
  });
}

function hideInput() {
  searchRecents.classList.remove("hidden");

  searchInput.classList.add("w-[2px]");
  searchInput.classList.remove("w-[180px]");
  setTimeout(() => {
    searchInput.classList.add("opacity-100");
    searchIcon.classList.remove("hidden");
    searchInput.classList.add("hidden");
  }, 600);
}

// Bắt sự kiện click vào icon
searchIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  showInput();
});

// Bắt sự kiện click ra ngoài
document.addEventListener("click", () => {
  if (!searchInput.classList.contains("hidden")) {
    hideInput();
  }
});

// Ngăn input ẩn khi click vào chính nó
searchInput.addEventListener("click", (e) => {
  e.stopPropagation();
});
