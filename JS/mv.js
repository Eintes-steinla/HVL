// JS/mv.js
// Hien thi MV (music video) ngay trong khu vuc #main, thay the noi dung trang nghe si
// Dung du lieu tu window.mvDatabase (JS/mv-data.js)
//
// Nguyen tac dong bo nut Play: CHI CO 1 ham duy nhat (syncPlayButtons) duoc phep
// ghi vao trang thai checked cua .play-button-song, va ham nay luon doc TRUC TIEP
// tu thuoc tinh .paused/.ended cua phan tu media dang active (video khi xem MV,
// audio khi khong) - khong bao gio "doan truoc" (optimistic) trang thai. Ham nay
// duoc goi lai moi khi co su kien play/pause/ended/emptied that su tren CA video
// lan audio (du la do bam nut custom, bam controls goc cua <video>, Media Session,
// hay trinh duyet tu xu ly khi doi tab/doi focus) -> UI khong con the bi "vo tinh"
// lech khoi trang thai that nua.

const mvBtn = document.querySelector(".mv-btn");
const mainContentForMv = document.getElementById("main");
const mvView = document.getElementById("mv-view");
const mvVideoEl = document.getElementById("mv-video");
const mvNoVideoEl = document.getElementById("mv-no-video");
const audioForMv = document.getElementById("audio-song");

let mvPanelOpen = false;
let currentMvFileName = null; // tranh gan lai src neu khong doi bai -> tranh ngat play() dang cho

function getCurrentTrackForMv() {
  const list = window.tracks || [];
  const index =
    typeof window.getCurrentTrackIndex === "function"
      ? window.getCurrentTrackIndex()
      : 0;
  return list[index];
}

// * play()/pause() an toan: chi nuot AbortError vo hai khi play() bi ngat boi
// pause() (vd bam Play roi bam Pause that nhanh). KHONG dung "lock" chan lenh
// chong nhau nua - do chinh la nguyen nhan cu gay hien tuong "luc dong bo duoc
// luc khong" (xem giai thich ben duoi phan syncPlayButtons). play()/pause() cua
// trinh duyet von da an toan de goi chong nhau, chi can nuot loi la du.
async function safePlay(el) {
  try {
    await el.play();
  } catch (err) {
    // vo hai - syncPlayButtons() se tu phan anh dung trang thai that
  }
}

function safePause(el) {
  try {
    el.pause();
  } catch (err) {
    // ignore
  }
}

// =============== Nguon su that duy nhat cho UI play/pause ===============

function getActiveMediaEl() {
  return mvPanelOpen ? mvVideoEl : audioForMv;
}

// * Ham DUY NHAT duoc phep cap nhat nut play (header/sticky/footer/...) + Media
// Session. Luon doc truc tiep .paused/.ended tai thoi diem goi -> khong the lech.
function syncPlayButtons() {
  const el = getActiveMediaEl();
  const playing = !el.paused && !el.ended;

  document.querySelectorAll(".play-button-song input").forEach((input) => {
    input.checked = !playing;
  });

  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }
}

function updateMediaSessionMetadata(track) {
  if (!("mediaSession" in navigator) || !track) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist || "",
      artwork: track.img
        ? [{ src: track.img, sizes: "512x512", type: "image/png" }]
        : [],
    });
  } catch (err) {
    // ignore neu MediaMetadata khong ho tro
  }
}

function bindMediaSessionHandlers() {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.setActionHandler("play", () => {
    safePlay(getActiveMediaEl());
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    safePause(getActiveMediaEl());
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    safePause(getActiveMediaEl());
  });
}

function renderMv() {
  const track = getCurrentTrackForMv();
  const fileName =
    track && window.mvDatabase ? window.mvDatabase[track.title] : null;

  if (fileName) {
    // * chi gan lai src khi thuc su doi bai -> tranh ngat play() dang cho vo ich
    if (currentMvFileName !== fileName) {
      currentMvFileName = fileName;
      mvVideoEl.src = `/media/mv/hvl_mv/${fileName}`;
      mvVideoEl.load();
    }
    mvVideoEl.classList.remove("hidden");
    mvNoVideoEl.classList.add("hidden");
    safePlay(mvVideoEl);
  } else {
    currentMvFileName = null;
    safePause(mvVideoEl);
    mvVideoEl.removeAttribute("src");
    mvVideoEl.load();
    mvVideoEl.classList.add("hidden");
    mvNoVideoEl.classList.remove("hidden");
  }

  syncPlayButtons();
  updateMediaSessionMetadata(track);
}

function updateMvButtonColor() {
  if (!mvBtn) return;
  const paths = mvBtn.querySelectorAll("svg path");
  paths.forEach((p) => {
    p.setAttribute("fill", mvPanelOpen ? "#1ED760" : "#BCBCC1");
  });
}

// =============== Toggle panel MV ===============

function toggleMvPanel(forceState) {
  const wasOpen = mvPanelOpen;
  mvPanelOpen = forceState !== undefined ? forceState : !mvPanelOpen;
  if (mvPanelOpen === wasOpen) return;

  mainContentForMv.classList.toggle("hidden", mvPanelOpen);
  mvView.classList.toggle("hidden", !mvPanelOpen);
  updateMvButtonColor();

  if (mvPanelOpen) {
    if (typeof window.closeLyricsPanel === "function")
      window.closeLyricsPanel();
    if (typeof window.closeQueuePanel === "function") window.closeQueuePanel();

    safePause(audioForMv);
    renderMv(); // renderMv() tu goi syncPlayButtons() sau khi xu ly xong
  } else {
    safePause(mvVideoEl);
    syncPlayButtons();
    updateMediaSessionMetadata(getCurrentTrackForMv());
  }
}

window.closeMvPanel = () => toggleMvPanel(false);
window.isMvPanelOpen = () => mvPanelOpen;

if (mvBtn) {
  mvBtn.addEventListener("click", () => toggleMvPanel());
}

audioForMv.addEventListener("loadedmetadata", () => {
  if (mvPanelOpen) renderMv();
});

// * CHAN CUNG: mp3 co gang phat trong luc dang xem MV -> tat ngay, khong cho phat chong
audioForMv.addEventListener("play", () => {
  if (mvPanelOpen) {
    safePause(audioForMv);
  }
});

// * NGUON DONG BO CHINH: bat ke play/pause/ended/emptied cua VIDEO hay AUDIO xay
// ra vi ly do gi (nut custom, controls goc cua <video>, Media Session, hay trinh
// duyet tu xu ly khi doi tab/doi focus), syncPlayButtons() deu duoc goi lai va
// luon doc dung trang thai that. Day la diem mau chot sua loi "luc dong bo duoc
// luc khong".
["play", "pause", "ended", "emptied"].forEach((evt) => {
  mvVideoEl.addEventListener(evt, syncPlayButtons);
  audioForMv.addEventListener(evt, syncPlayButtons);
});

// * Luoi an toan bo sung: tab/cua so mat focus roi quay lai (bam ra ngoai trinh
// duyet, chuyen app, di chuot ra khoi vung xem truoc co iframe...) thi dong bo
// lai 1 lan nua cho chac. Vi syncPlayButtons() gio la ham DUY NHAT va luon doc
// dung trang thai that, goi lai bao nhieu lan cung khong the gay lech.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") syncPlayButtons();
});
window.addEventListener("focus", syncPlayButtons);

// * Khi dang xem MV, TAT CA nut "play" (checkbox .play-button-song) phai dieu khien VIDEO
// thay vi mp3. Dung capture phase + stopPropagation de chan handler mac dinh cua
// play-button.js (dang dieu khien audio-song) truoc khi no kip chay.
document.addEventListener(
  "click",
  (e) => {
    if (!mvPanelOpen) return;

    const label = e.target.closest(".play-button-song");
    if (!label) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const willPlay = mvVideoEl.paused || mvVideoEl.ended;
    if (willPlay) {
      safePlay(mvVideoEl);
    } else {
      safePause(mvVideoEl);
    }
    // .play()/.pause() da doi .paused NGAY LAP TUC (dong bo), nen goi
    // syncPlayButtons() luon o day la du de UI phan hoi tuc thi va luon dung -
    // khong con can cap nhat checkbox "doan truoc" (optimistic) nhu code cu.
    syncPlayButtons();
  },
  true, // capture: chay truoc moi handler khac gan tren cung phan tu
);

// * Nuot gon AbortError vo hai (play() bi ngat boi pause()) de khong con lot ra console
window.addEventListener("unhandledrejection", (e) => {
  if (
    e.reason &&
    e.reason.name === "AbortError" &&
    /interrupted by a call to pause/i.test(e.reason.message || "")
  ) {
    e.preventDefault();
  }
});

bindMediaSessionHandlers();
