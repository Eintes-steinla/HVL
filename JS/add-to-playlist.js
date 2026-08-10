// ========== 1. Add to playlist (click) ==========
document.addEventListener("click", (e) => {
  const container = e.target.closest(".add-to-playlist");
  if (!container) return;

  const svgClicked = e.target.closest("svg");
  if (!svgClicked) return;

  e.stopPropagation();

  const firstSvg = container.querySelector("svg:first-of-type");
  const secondSvg = container.querySelector("svg:last-of-type");

  if (svgClicked === firstSvg) {
    firstSvg.classList.add("hidden");
    secondSvg.classList.remove("hidden");
  } else {
    firstSvg.classList.remove("hidden");
    secondSvg.classList.add("hidden");
  }
});

// ========== 2. Hover STT -> hiện icon play (track-main thường) ==========
document.addEventListener("pointerover", (e) => {
  const track = e.target.closest(".track-main");
  if (!track || track.id === "five-line") return;
  if (track.contains(e.relatedTarget)) return; // đang ở trong track, bỏ qua

  const container = track.querySelector(".stt-play");
  if (!container) return;

  container.querySelector("span:first-of-type").classList.add("hidden");
  container.querySelector("span:last-of-type").classList.remove("hidden");
});

document.addEventListener("pointerout", (e) => {
  const track = e.target.closest(".track-main");
  if (!track || track.id === "five-line") return;
  if (track.contains(e.relatedTarget)) return; // vẫn còn trong track, bỏ qua

  const container = track.querySelector(".stt-play");
  if (!container) return;

  container.querySelector("span:first-of-type").classList.remove("hidden");
  container.querySelector("span:last-of-type").classList.add("hidden");
});

// ========== 3. Track "five-line" (now playing) - phần tử tĩnh, không đổi ==========
const fiveLineTrack = document.getElementById("five-line");
if (fiveLineTrack) {
  const playing = document.getElementById("playing");
  const stop = document.getElementById("five-line-stop");

  if (window.matchMedia("(max-width: 639.99px)").matches) {
    fiveLineTrack.addEventListener("click", (e) => {
      e.stopPropagation();
      playing.classList.add("hidden");
      stop.classList.remove("hidden");
    });
    document.addEventListener("click", (e) => {
      e.stopPropagation();
      playing.classList.remove("hidden");
      stop.classList.add("hidden");
    });
  } else {
    fiveLineTrack.addEventListener("pointerenter", (e) => {
      e.stopPropagation();
      playing.classList.add("hidden");
      playing.classList.remove("flex");
      stop.classList.remove("hidden");
    });
    fiveLineTrack.addEventListener("pointerleave", (e) => {
      e.stopPropagation();
      playing.classList.remove("hidden");
      playing.classList.add("flex");
      stop.classList.add("hidden");
    });
  }
}