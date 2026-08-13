// JS/queue.js
// Hien thi hang doi phat nhac (Now playing + Next from queue + Next up)
// Dung chung cho ca desktop (sidebar) va mobile (hien trong #main nhu lyrics)

const queueBtn = document.querySelector(".queue-btn");
const playingViewNormal = document.getElementById("playing-view-normal"); // chi co tren desktop
const mainContentForQueue = document.getElementById("main"); // dung khi o mobile
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

// * luu cac bai da "Them vao danh sach phat" (demo don gian, dung chung ca 2 layout)
window.playlistSet = window.playlistSet || new Set();
window.toggleAddToPlaylist = function (index) {
  if (window.playlistSet.has(index)) {
    window.playlistSet.delete(index);
  } else {
    window.playlistSet.add(index);
  }
};

function trackRowHTML(track, realIndex, { inQueue = false } = {}) {
  return `
    <div data-index="${realIndex}" class="group flex justify-between items-center gap-3 hover:bg-[#282831] px-3 py-2 rounded cursor-pointer queue-item">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${track.img}" alt="${track.title}" class="rounded w-10 h-10 object-cover" />
        <div class="min-w-0">
          <div class="text-white text-sm truncate">${track.title}</div>
          <div class="text-[#a7a7a7] text-xs truncate">${track.artist ?? ""}</div>
        </div>
      </div>

      <!-- * 3 dots -->
      <div class="relative queue-more">
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="queue-more-toggle hover:scale-105 active:scale-95 cursor-pointer" viewBox="0 0 24 24" width="20" height="20">
          <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill-opacity="1" fill="#fff"></path>
        </svg>

        <!-- * popup -->
        <div class="hidden right-0 top-full z-50 absolute bg-[#282828] shadow-xl mt-1 rounded-md w-[230px] overflow-hidden queue-more-menu">
          ${
            inQueue
              ? `<button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-remove-item">
                  <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583M2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z" fill="#B3B3B3"></path>
                  </svg>
                  <span class="text-white text-sm">Xóa khỏi hàng đợi</span>
                </button>`
              : `<button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-add-item">
                  <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M16 15H2v-1.5h14zm0-4.5H2V9h14zm-8.034-6A5.5 5.5 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2z" fill="#B3B3B3"></path>
                  </svg>
                  <span class="text-white text-sm">Thêm vào hàng đợi</span>
                </button>`
          }
          <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer queue-add-playlist-item">
            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
              <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
            </svg>
            <span class="text-white text-sm">Thêm vào danh sách phát</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderQueue() {
  const list = window.tracks || [];
  const currentIndex = getCurrentTrackIndexSafe();
  const current = list[currentIndex];
  const customQueue = window.customQueue || [];

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

  if (customQueue.length) {
    html += `
      <div class="mb-6">
        <h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Next from queue</h3>
        <div class="space-y-1">
          ${customQueue
            .filter((idx) => list[idx])
            .map((idx) => trackRowHTML(list[idx], idx, { inQueue: true }))
            .join("")}
        </div>
      </div>
    `;
  }

  const upcoming = list
    .map((track, i) => ({ track, i }))
    .slice(currentIndex + 1)
    .filter(({ i }) => !customQueue.includes(i));

  html += `<h3 class="mb-2 font-[SpotifyMixUITitleBold] text-white text-sm">Next up</h3>`;

  if (!upcoming.length) {
    html += `<p class="text-[#a7a7a7] text-sm">No more songs in queue.</p>`;
  } else {
    html +=
      `<div class="space-y-1">` +
      upcoming
        .map(({ track, i }) => trackRowHTML(track, i, { inQueue: false }))
        .join("") +
      `</div>`;
  }

  queueList.innerHTML = html;

  // * mo/dong popup more-options trong queue
  queueList.querySelectorAll(".queue-more-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = toggle
        .closest(".queue-more")
        .querySelector(".queue-more-menu");
      queueList.querySelectorAll(".queue-more-menu").forEach((m) => {
        if (m !== menu) m.classList.add("hidden");
      });
      menu.classList.toggle("hidden");
    });
  });

  // * them vao hang doi (tu dong Next up)
  queueList.querySelectorAll(".queue-add-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.addToQueue(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * xoa khoi hang doi (tu dong Next from queue)
  queueList.querySelectorAll(".queue-remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.removeFromQueue(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * them vao danh sach phat
  queueList.querySelectorAll(".queue-add-playlist-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.closest(".queue-item").dataset.index);
      window.toggleAddToPlaylist(idx);
      btn.closest(".queue-more-menu").classList.add("hidden");
    });
  });

  // * click vao dong -> phat bai do (va tu dong bo khoi hang doi neu dang trong hang doi)
  queueList.querySelectorAll(".queue-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.index);
      const customQueue = window.customQueue || [];
      const pos = customQueue.indexOf(idx);
      if (pos !== -1) {
        customQueue.splice(pos, 1);
        if (typeof window.onQueueChange === "function") window.onQueueChange();
      }
      if (typeof window.playTrackAtIndex === "function") {
        window.playTrackAtIndex(idx);
      }
    });
  });
}

const QUEUE_ACTIVE_COLOR = "#1ED760";
const QUEUE_INACTIVE_COLOR = "#BCBCC1";

function syncQueueBtnColor() {
  if (!queueBtn) return;
  const paths = queueBtn.querySelectorAll("svg path");
  paths.forEach((p) => {
    p.setAttribute(
      "fill",
      queuePanelOpen ? QUEUE_ACTIVE_COLOR : QUEUE_INACTIVE_COLOR,
    );
  });
}

function toggleQueuePanel(forceState) {
  queuePanelOpen = forceState !== undefined ? forceState : !queuePanelOpen;

  if (playingViewNormal) {
    // * Desktop: sidebar "Now playing" <-> "Queue"
    playingViewNormal.classList.toggle("hidden", queuePanelOpen);
  } else if (mainContentForQueue) {
    // * Mobile: #main <-> Queue toan man hinh (giong lyrics)
    mainContentForQueue.classList.toggle("hidden", queuePanelOpen);

    // * tranh xung dot voi panel lyrics dang mo
    if (queuePanelOpen && typeof window.closeLyricsPanel === "function") {
      window.closeLyricsPanel();
    }
  }

  if (queueView) queueView.classList.toggle("hidden", !queuePanelOpen);

  syncQueueBtnColor();

  if (queuePanelOpen) {
    renderQueue();
  }
}

window.closeQueuePanel = () => toggleQueuePanel(false);
window.isQueuePanelOpen = () => queuePanelOpen;

if (queueBtn) {
  queueBtn.addEventListener("click", () => toggleQueuePanel());
}
if (queueViewClose) {
  queueViewClose.addEventListener("click", () => toggleQueuePanel(false));
}

audioForQueue.addEventListener("loadedmetadata", () => {
  if (queuePanelOpen) renderQueue();
});

// * dong popup khi click ra ngoai
document.addEventListener("click", (e) => {
  if (!e.target.closest(".queue-more")) {
    queueList
      .querySelectorAll(".queue-more-menu")
      .forEach((m) => m.classList.add("hidden"));
  }
});

// Goi lai khi customQueue thay doi (tu tracks.js / tracks-mobile.js)
window.onQueueChange = () => {
  if (queuePanelOpen) renderQueue();
};
