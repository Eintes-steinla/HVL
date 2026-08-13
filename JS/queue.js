// JS/queue.js
// Hien thi hang doi phat nhac (Now playing + Next up) trong panel "playing view"

const queueBtn = document.querySelector(".queue-btn");
const playingViewNormal = document.getElementById("playing-view-normal");
const queueView = document.getElementById("queue-view");
const queueList = document.getElementById("queue-view-list");
const queueViewClose = document.getElementById("queue-view-close");
const audioForQueue = document.getElementById("audio-song");

let queuePanelOpen = false;

function getCurrentTrackIndexSafe() {
  return typeof window.getCurrentTrackIndex === "function"
    ? window.getCurrentTrackIndex()
    : 0;
}

function renderQueue() {
  const list = window.tracks || [];
  const currentIndex = getCurrentTrackIndexSafe();
  const current = list[currentIndex];
  const upcoming = list.slice(currentIndex + 1);

  let html = "";

  if (current) {
    html += `
      <div class="mb-6">
        <h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Now playing</h3>
        <div class="flex items-center gap-3 bg-[#1E1E2E] px-3 py-2 rounded">
          <img src="${current.img}" alt="${current.title}" class="rounded w-10 h-10 object-cover" />
          <div class="min-w-0">
            <div class="text-[#1ED760] text-sm truncate">${current.title}</div>
            <div class="text-[#a7a7a7] text-xs truncate">${current.artist ?? ""}</div>
          </div>
        </div>
      </div>
    `;
  }

  html += `<h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Next up</h3>`;

  if (!upcoming.length) {
    html += `<p class="text-[#a7a7a7] text-sm">No more songs in queue.</p>`;
  } else {
    html +=
      `<div class="space-y-1">` +
      upcoming
        .map((track, i) => {
          const realIndex = currentIndex + 1 + i;
          return `
            <div data-index="${realIndex}" class="group flex items-center gap-3 hover:bg-[#282831] px-3 py-2 rounded cursor-pointer queue-item">
              <img src="${track.img}" alt="${track.title}" class="rounded w-10 h-10 object-cover" />
              <div class="min-w-0">
                <div class="text-white text-sm truncate">${track.title}</div>
                <div class="text-[#a7a7a7] text-xs truncate">${track.artist ?? ""}</div>
              </div>
            </div>
          `;
        })
        .join("") +
      `</div>`;
  }

  queueList.innerHTML = html;

  queueList.querySelectorAll(".queue-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.index);
      if (typeof window.playTrackAtIndex === "function") {
        window.playTrackAtIndex(idx);
      }
    });
  });
}

function toggleQueuePanel(forceState) {
  queuePanelOpen = forceState !== undefined ? forceState : !queuePanelOpen;

  playingViewNormal.classList.toggle("hidden", queuePanelOpen);
  queueView.classList.toggle("hidden", !queuePanelOpen);

  if (queuePanelOpen) {
    renderQueue();
  }
}

if (queueBtn) {
  queueBtn.addEventListener("click", () => toggleQueuePanel());
}
if (queueViewClose) {
  queueViewClose.addEventListener("click", () => toggleQueuePanel(false));
}

// Khi doi bai (next/prev/click chon bai), cap nhat lai danh sach "Next up" neu dang mo
audioForQueue.addEventListener("loadedmetadata", () => {
  if (queuePanelOpen) renderQueue();
});
