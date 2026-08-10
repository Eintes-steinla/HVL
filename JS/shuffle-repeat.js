(function () {
  const shuffleBtn = document.getElementById("shuffle-btn");
  const repeatBtn = document.getElementById("repeat-btn");
  const repeatIcon = document.getElementById("repeat-icon");
  const repeatOneIcon = document.getElementById("repeat-one-icon");

  if (!shuffleBtn || !repeatBtn || !repeatIcon || !repeatOneIcon) {
    console.warn(
      "shuffle-repeat.js: thiếu phần tử cần thiết, kiểm tra lại id trong HTML",
    );
    return;
  }

  const COLOR_ACTIVE = "#1ED760";
  const COLOR_INACTIVE = "#999FB9";

  // ----- Trạng thái toàn cục (next-song.js đọc 2 biến này) -----
  window.isShuffle = false;
  window.repeatMode = "off"; // "off" | "all" | "one"

  function setIconColor(svgEl, color) {
    svgEl
      .querySelectorAll("path")
      .forEach((p) => p.setAttribute("fill", color));
  }

  // ----- Shuffle -----
  function updateShuffleUI() {
    setIconColor(
      shuffleBtn.querySelector("svg"),
      window.isShuffle ? COLOR_ACTIVE : COLOR_INACTIVE,
    );
  }

  shuffleBtn.addEventListener("click", () => {
    window.isShuffle = !window.isShuffle;
    updateShuffleUI();
  });

  // ----- Repeat: tắt -> lặp tất cả -> lặp 1 bài -> tắt -----
  function updateRepeatUI() {
    if (window.repeatMode === "one") {
      repeatIcon.classList.add("hidden");
      repeatOneIcon.classList.remove("hidden");
      setIconColor(repeatOneIcon, COLOR_ACTIVE);
    } else {
      repeatOneIcon.classList.add("hidden");
      repeatIcon.classList.remove("hidden");
      setIconColor(
        repeatIcon,
        window.repeatMode === "all" ? COLOR_ACTIVE : COLOR_INACTIVE,
      );
    }
  }

  repeatBtn.addEventListener("click", () => {
    window.repeatMode =
      window.repeatMode === "off"
        ? "all"
        : window.repeatMode === "all"
          ? "one"
          : "off";
    updateRepeatUI();
  });

  // Khởi tạo màu icon ban đầu
  updateShuffleUI();
  updateRepeatUI();
})();
