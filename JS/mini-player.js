// JS/mini-player.js
// Mini Player dang cua so noi tach khoi tab (Document Picture-in-Picture)
// Chi ho tro trinh duyet nen Chromium (Chrome, Edge, Brave)
//
// Giao dien: mac dinh mo hinh vuong 1:1 (anh bia phu day).
// - Khong hover: chi hien anh bia.
// - Hover: hien overlay toi + cac nut dieu khien + thanh progress.
// - Resize lech ti le: anh giu vuong, can giua, phan du to mau den (letterbox).
// - Trang thai truc quan (shuffle/repeat/volume) duoc dong bo hai chieu voi nut goc.
// - Nut follow trong mini player la TOGGLE CUC BO (khong doc/goi nut follow cua trang
//   chinh) - bam vao chi doi mau/icon tai cho, khong lam gi khac.
// - Thanh progress dung dung mau xanh la (#1DB954), khong dung mau accent mac dinh cua browser.
//
// * Da chuyen toan bo CSS trong mpStyle sang class Tailwind, gan truc tiep tren tung the.
//   Nhung gi Tailwind khong lam duoc (pseudo-element ::-webkit-slider-thumb /
//   ::-moz-range-thumb cua <input type="range">) van giu nguyen o dang CSS thuan
//   trong khoi <style> rieng (mp-thumb-style).

const miniPlayerBtn = document.getElementById("mini-player-btn");
let pipWindow = null;

const SQUARE_SIZE = 360;
const INFO_HEIGHT = 78;
// * kich thuoc toi thieu cua anh vuong - khi thu nho chieu doc (hoac ngang) vuot qua
//   gioi han nay, anh se ngung co lai (chieu cao toi thieu = chieu rong toi thieu vi
//   anh luon la hinh vuong 1:1); phan du se bi cat (letterbox/tran ra ngoai container).
const MIN_SQUARE_SIZE = 160;
// * kich thuoc canvas dung de doc pixel tinh mau chu dao - cang nho cang nhanh,
//   40px la du chinh xac cho muc dich lam mau nen (khong can chi tiet).
const COLOR_SAMPLE_SIZE = 40;
// * cache mau chu dao theo URL anh - tranh tinh lai khi quay lai bai da phat
const dominantColorCache = new Map();

// * Mau mac dinh khi khong doc duoc mau anh (vi du bi chan CORS tu R2) - dang
//   "r, g, b" de ghep truc tiep vao rgba(...); dong bo voi DEFAULT_BG_COLOR trong
//   lyrics.js (#1E1E2E) de trai nghiem nhat quan giua 2 noi.
const DEFAULT_BG_COLOR = "30, 30, 46";

function isPiPSupported() {
  return "documentPictureInPicture" in window;
}

// * doc pixel cua anh (da resize xuong COLOR_SAMPLE_SIZE) va tra ve mau trung binh
//   dang "r, g, b" (khong bao "rgb(...)" de con ghep vao rgba() khi can do trong suot).
//   Neu anh khac origin va bucket khong bat CORS, viec doc pixel se that bai ->
//   fallback ve DEFAULT_BG_COLOR thay vi tra null (tranh mat han mau nen).
function extractDominantColor(imgSrc) {
  if (dominantColorCache.has(imgSrc)) {
    return Promise.resolve(dominantColorCache.get(imgSrc));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = COLOR_SAMPLE_SIZE;
        canvas.height = COLOR_SAMPLE_SIZE;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, COLOR_SAMPLE_SIZE, COLOR_SAMPLE_SIZE);
        const { data } = ctx.getImageData(
          0,
          0,
          COLOR_SAMPLE_SIZE,
          COLOR_SAMPLE_SIZE,
        );

        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 125) continue; // bo pixel gan nhu trong suot
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) {
          dominantColorCache.set(imgSrc, DEFAULT_BG_COLOR);
          resolve(DEFAULT_BG_COLOR);
          return;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const color = `${r}, ${g}, ${b}`;
        dominantColorCache.set(imgSrc, color);
        resolve(color);
      } catch (err) {
        // Anh bi chan CORS (tainted canvas) -> dung mau mac dinh, giong lyrics.js
        console.warn("Khong doc duoc mau chu dao cua anh:", err);
        dominantColorCache.set(imgSrc, DEFAULT_BG_COLOR);
        resolve(DEFAULT_BG_COLOR);
      }
    };
    img.onerror = () => {
      dominantColorCache.set(imgSrc, DEFAULT_BG_COLOR);
      resolve(DEFAULT_BG_COLOR);
    };
    img.src = imgSrc;
  });
}

function setMiniPlayerActive(active) {
  if (!miniPlayerBtn) return;
  miniPlayerBtn.classList.toggle("is-active", active);
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

async function openMiniPlayer() {
  if (!isPiPSupported()) {
    alert(
      "Trinh duyet nay chua ho tro Mini Player. Vui long dung Chrome, Edge hoac Brave ban moi.",
    );
    return;
  }

  if (pipWindow) {
    pipWindow.close();
    return;
  }

  try {
    pipWindow = await documentPictureInPicture.requestWindow({
      width: SQUARE_SIZE,
      height: SQUARE_SIZE + INFO_HEIGHT,
    });
  } catch (err) {
    console.warn("Khong the mo mini player:", err);
    setMiniPlayerActive(false);
    return;
  }

  setMiniPlayerActive(true);

  // * chep lai cac stylesheet cua trang chinh (bao gom file Tailwind da build, neu co)
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = document.createElement("style");
      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      if (styleSheet.href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    }
  });

  // * pipWindow la mot document rieng biet -> nap them Tailwind (CDN JIT) de dam bao
  //   moi class Tailwind dung trong mini player (ke ca cac class chi xuat hien o day)
  //   deu duoc sinh CSS, khong phu thuoc vao build cua trang chinh co dung toi hay khong.
  const twScript = pipWindow.document.createElement("script");
  twScript.src = "https://cdn.tailwindcss.com";
  pipWindow.document.head.appendChild(twScript);

  // * CSS thuan - CHI cho nhung gi Tailwind khong the lam duoc:
  //   pseudo-element cua input[type=range] (::-webkit-slider-thumb / ::-moz-range-thumb).
  //   Mau gradient nen cua thanh progress duoc JS gan truc tiep qua style.background
  //   (xem updateMpProgressBar) nen khong can khai bao lai o day.
  const thumbStyle = pipWindow.document.createElement("style");
  thumbStyle.id = "mp-thumb-style";
  thumbStyle.textContent = `
    #mp-progress::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0;
      height: 0;
    }
    #mp-progress::-moz-range-thumb {
      width: 0;
      height: 0;
      border: none;
    }
    #mp-progress.hovered::-webkit-slider-thumb,
    #mp-progress.dragging::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
    }
    #mp-progress.hovered::-moz-range-thumb,
    #mp-progress.dragging::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  `;
  pipWindow.document.head.appendChild(thumbStyle);

  // * reset html/body bang class Tailwind thay vi CSS the "html, body { ... }"
  pipWindow.document.documentElement.className =
    "m-0 p-0 h-full overflow-hidden bg-black";
  pipWindow.document.body.className = "m-0 p-0 h-full overflow-hidden bg-black";

  pipWindow.document.body.innerHTML = `
    <div id="mp-root" class="bg-black h-screen w-screen flex flex-col overflow-hidden">
      <div id="mp-square-wrap" class="group flex-1 min-h-0 flex items-center justify-center bg-black relative overflow-hidden transition-colors duration-500 ease-in-out">
        <div id="mp-square" class="relative overflow-hidden shrink-0">
          <img id="mp-bg" src="" alt="" class="w-full h-full object-cover block" />
          <div id="mp-overlay" class="absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 bg-[linear-gradient(to_top,rgba(0,0,0,.8),rgba(0,0,0,.1)_45%,rgba(0,0,0,.35))]">
            <div></div>
            <div id="mp-controls-row" class="flex items-center justify-center gap-4 pb-2">
              <button id="mp-volume" title="Volume" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg id="mp-volume-unmute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18">
                  <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" fill-opacity="0.9" fill="#CDD6F4"></path>
                  <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" fill-opacity="0.9" fill="#CDD6F4"></path>
                </svg>
                <svg id="mp-volume-mute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" style="display:none;">
                  <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" fill-opacity="0.9" fill="#CDD6F4"></path>
                  <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z" fill-opacity="0.9" fill="#CDD6F4"></path>
                </svg>
              </button>
              <button id="mp-shuffle" title="Shuffle" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg id="mp-shuffle-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18">
                  <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" fill-opacity="0.9" fill="#999FB9"></path>
                  <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z" fill-opacity="0.9" fill="#999FB9"></path>
                </svg>
              </button>
              <button id="mp-prev" title="Previous" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
                  <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" fill-opacity="0.95" fill="#FFFFFF"></path>
                </svg>
              </button>
              <button id="mp-play-btn" title="Play/Pause" class="bg-white hover:bg-white min-w-11 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-none transition-transform duration-150 ease-in-out hover:scale-[1.06] active:scale-[0.92]">
                <svg id="mp-play-icon" viewBox="0 0 384 512" width="16" height="16">
                  <path fill="#000000" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                </svg>
                <svg id="mp-pause-icon" viewBox="0 0 320 512" width="16" height="16" style="display:none;">
                  <path fill="#000000" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"></path>
                </svg>
              </button>
              <button id="mp-next" title="Next" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
                  <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" fill-opacity="0.95" fill="#FFFFFF"></path>
                </svg>
              </button>
              <button id="mp-repeat" title="Repeat" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg id="mp-repeat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18">
                  <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" fill-opacity="0.9" fill="#999FB9"></path>
                </svg>
                <svg id="mp-repeat-one-icon" viewBox="0 0 16 16" width="18" height="18" style="display:none;">
                  <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75zM12.25 2.5a2.25 2.25 0 0 1 2.25 2.25v5A2.25 2.25 0 0 1 12.25 12H9.81l1.018-1.018a.75.75 0 0 0-1.06-1.06L6.939 12.75l2.829 2.828a.75.75 0 1 0 1.06-1.06L9.811 13.5h2.439A3.75 3.75 0 0 0 16 9.75v-5A3.75 3.75 0 0 0 12.25 1h-.75v1.5z" fill="#999FB9"></path>
                  <path d="m8 1.85.77.694H6.095V1.488q1.046-.077 1.507-.385.474-.308.583-.913h1.32V8H8z" fill="#999FB9"></path>
                </svg>
              </button>
              <button id="mp-share" title="Share" class="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-transform duration-150 ease-in-out hover:scale-[1.06] hover:bg-white/[0.08] active:scale-[0.92]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18">
                  <path d="M1 5.75A.75.75 0 0 1 1.75 5H4v1.5H2.5v8h11v-8H12V5h2.25a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75v-9.5z" fill-opacity="0.9" fill="#CDD6F4"></path>
                  <path d="M8 9.576a.75.75 0 0 0 .75-.75V2.903l1.454 1.454a.75.75 0 0 0 1.06-1.06L8 .03 4.735 3.296a.75.75 0 0 0 1.06 1.061L7.25 2.903v5.923c0 .414.336.75.75.75z" fill-opacity="0.9" fill="#CDD6F4"></path>
                </svg>
              </button>
            </div>
            <div></div>
          </div>
        </div>
        <!-- * thanh progress dat NGOAI #mp-square (khong bi overflow-hidden cua khung
             anh vuong cat mat), nhung van la con cua #mp-square-wrap nen "nam tren"
             (de len tren) div chua anh. inset-x-0 -> rong bang toan bo chieu rong cua
             so mini (vi #mp-square-wrap da la flex item full-width cua #mp-root). -->
        <div id="mp-progress-row" class="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 px-[14px] pb-3 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
          <span id="mp-current-time" class="text-[#CDD6F4] text-[11px] w-[30px]">0:00</span>
          <input id="mp-progress" type="range" min="0" max="100" step="1" value="0"
            class="flex-1 appearance-none h-1 rounded-full transition-[background] duration-150 ease-linear cursor-pointer [accent-color:#1DB954]" />
          <span id="mp-duration" class="text-[#CDD6F4] text-[11px] w-[30px] text-right">0:00</span>
        </div>
      </div>
      <div id="mp-info" class="shrink-0 bg-black flex items-center justify-between px-4 py-3">
        <div class="min-w-0 flex flex-col">
          <span id="mp-title" class="text-white text-[15px] font-bold whitespace-nowrap overflow-hidden text-ellipsis block"></span>
          <span id="mp-artist" class="text-[#CDD6F4] text-xs whitespace-nowrap overflow-hidden text-ellipsis block"></span>
        </div>
        <button id="mp-follow" title="Follow" class="bg-transparent border-none cursor-pointer p-0 shrink-0 transition-transform duration-150 ease-in-out hover:scale-[1.08] active:scale-[0.94]">
          <svg id="mp-follow-check" viewBox="0 0 16 16" width="22" height="22" style="display:none;">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" fill="#1ED78B"></path>
          </svg>
          <svg id="mp-follow-plus" viewBox="0 0 24 24" width="22" height="22">
            <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z" fill="#CDD6F4"></path>
            <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z" fill="#CDD6F4"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // * tham chieu element trong pip
  const squareWrap = pipWindow.document.getElementById("mp-square-wrap");
  const squareBox = pipWindow.document.getElementById("mp-square");
  const mpBg = pipWindow.document.getElementById("mp-bg");
  const mpTitle = pipWindow.document.getElementById("mp-title");
  const mpArtist = pipWindow.document.getElementById("mp-artist");
  const mpPlayBtn = pipWindow.document.getElementById("mp-play-btn");
  const mpPlayIcon = pipWindow.document.getElementById("mp-play-icon");
  const mpPauseIcon = pipWindow.document.getElementById("mp-pause-icon");
  const mpPrev = pipWindow.document.getElementById("mp-prev");
  const mpNext = pipWindow.document.getElementById("mp-next");
  const mpShuffle = pipWindow.document.getElementById("mp-shuffle");
  const mpShuffleSvg = pipWindow.document.getElementById("mp-shuffle-svg");
  const mpRepeat = pipWindow.document.getElementById("mp-repeat");
  const mpRepeatIcon = pipWindow.document.getElementById("mp-repeat-icon");
  const mpRepeatOneIcon =
    pipWindow.document.getElementById("mp-repeat-one-icon");
  const mpVolume = pipWindow.document.getElementById("mp-volume");
  const mpVolumeUnmute = pipWindow.document.getElementById("mp-volume-unmute");
  const mpVolumeMute = pipWindow.document.getElementById("mp-volume-mute");
  const mpShare = pipWindow.document.getElementById("mp-share");
  const mpFollow = pipWindow.document.getElementById("mp-follow");
  const mpFollowCheck = pipWindow.document.getElementById("mp-follow-check");
  const mpFollowPlus = pipWindow.document.getElementById("mp-follow-plus");
  const mpProgress = pipWindow.document.getElementById("mp-progress");
  const mpCurrentTime = pipWindow.document.getElementById("mp-current-time");
  const mpDuration = pipWindow.document.getElementById("mp-duration");

  const audio = document.getElementById("audio-song");
  let isSeeking = false;
  // * dem so lan doi bai - dung de "huy" ket qua tinh mau cua bai truoc do neu
  //   nguoi dung chuyen bai qua nhanh (tranh mau nen ap sai bai).
  let mpBgRequestToken = 0;
  // * trang thai follow CUC BO trong mini player - khong doc/ghi gi tu nut follow
  //   cua trang chinh, chi doi mau/icon tai cho khi bam.
  let mpIsFollowed = false;

  // * giu vuong 1:1, phan du to den (letterbox) - kich thuoc dong nen van gan qua JS,
  //   khong the thay bang class Tailwind tinh (compile-time)
  function fitSquare() {
    const availW = squareWrap.clientWidth;
    const availH = squareWrap.clientHeight;
    // * gioi han duoi: du khong gian con lai nho hon MIN_SQUARE_SIZE, anh van giu
    //   toi thieu MIN_SQUARE_SIZE x MIN_SQUARE_SIZE (khong tiep tuc co nho hon nua)
    const size = Math.max(MIN_SQUARE_SIZE, Math.min(availW, availH));
    squareBox.style.width = size + "px";
    squareBox.style.height = size + "px";
  }
  fitSquare();
  const resizeObserver = new pipWindow.ResizeObserver(fitSquare);
  resizeObserver.observe(squareWrap);

  // * ap dung mau nen chu dao cho khung anh (letterbox). Rieng #mp-info luon giu
  //   mau den mac dinh, khong doi theo mau chu dao cua anh. extractDominantColor
  //   luon tra ve mot chuoi "r, g, b" hop le (that bai -> DEFAULT_BG_COLOR) nen o
  //   day khong can kiem tra falsy nua.
  function applyDominantBackground(imgSrc, requestToken) {
    extractDominantColor(imgSrc).then((rgb) => {
      // * neu trong luc cho anh khac da duoc chon (doi bai lien tuc) thi bo qua
      //   ket qua cu, tranh mau nen "tre" mot nhip so voi bai dang phat.
      if (requestToken !== mpBgRequestToken) return;
      // * lam toi mau chu dao mot chut (thay vi dung nguyen) de chu/icon trang
      //   tren nen van de doc, giong cach Spotify/Apple Music lam.
      squareWrap.style.backgroundColor = `rgba(${rgb}, 0.55)`;
    });
  }

  function updateMiniPlayerInfo() {
    const list = window.tracks || [];
    const index =
      typeof window.getCurrentTrackIndex === "function"
        ? window.getCurrentTrackIndex()
        : 0;
    const track = list[index];
    if (!track) return;
    mpBg.src = track.img;
    mpTitle.textContent = track.title;
    mpArtist.textContent = track.artist ?? "";
    mpBgRequestToken++;
    applyDominantBackground(track.img, mpBgRequestToken);
  }

  function updatePlayIcon() {
    mpPlayIcon.style.display = audio.paused ? "block" : "none";
    mpPauseIcon.style.display = audio.paused ? "none" : "block";
  }

  // * cap nhat gradient mau cho thanh progress - giong logic play-progress.js
  //   (gan truc tiep qua style.background vi day la gia tri dong theo % tien do,
  //   Tailwind khong the sinh class cho gia tri lien tuc nay)
  function updateMpProgressBar() {
    const max = Number(mpProgress.max) || 100;
    const value = (Number(mpProgress.value) / max) * 100;
    const isHovered = mpProgress.classList.contains("hovered");
    const isDragging = mpProgress.classList.contains("dragging");
    const color = isHovered || isDragging ? "#1DB954" : "white";
    mpProgress.style.background = `linear-gradient(to right, ${color} ${value}%, gray ${value}%)`;
  }

  function updateProgress() {
    if (isSeeking) return;
    if (isFinite(audio.duration) && audio.duration > 0) {
      mpProgress.value = (audio.currentTime / audio.duration) * 100;
    }
    mpCurrentTime.textContent = formatTime(audio.currentTime);
    mpDuration.textContent = formatTime(audio.duration);
    updateMpProgressBar();
  }

  // * hover/drag cho thanh progress mini player
  mpProgress.addEventListener("mouseenter", () => {
    mpProgress.classList.add("hovered");
    updateMpProgressBar();
  });
  mpProgress.addEventListener("mouseleave", () => {
    mpProgress.classList.remove("hovered");
    if (!mpProgress.classList.contains("dragging")) updateMpProgressBar();
  });
  mpProgress.addEventListener("mousedown", () => {
    mpProgress.classList.add("dragging");
    updateMpProgressBar();
  });
  pipWindow.document.addEventListener("mouseup", () => {
    if (mpProgress.classList.contains("dragging")) {
      mpProgress.classList.remove("dragging");
      if (!mpProgress.classList.contains("hovered")) updateMpProgressBar();
    }
  });

  // ===== DONG BO TRANG THAI TRUC QUAN (hieu ung mau/icon toggle) =====
  // * Luu y: follow KHONG con trong danh sach dong bo nay - xem mpFollow ben duoi.
  function copyFill(sourceEl, targetEl) {
    if (!sourceEl || !targetEl) return;
    const srcPaths = sourceEl.querySelectorAll("path");
    const dstPaths = targetEl.querySelectorAll("path");
    srcPaths.forEach((p, i) => {
      if (!dstPaths[i]) return;
      const color = window.getComputedStyle(p).fill;
      if (color && color !== "none") dstPaths[i].setAttribute("fill", color);
    });
  }

  function syncShuffleState() {
    const mainShuffleIcon = document.getElementById("shuffle-icon");
    copyFill(mainShuffleIcon, mpShuffleSvg);
  }

  function syncRepeatState() {
    const mainRepeatIcon = document.getElementById("repeat-icon");
    const mainRepeatOneIcon = document.getElementById("repeat-one-icon");
    if (!mainRepeatIcon || !mainRepeatOneIcon) return;
    const oneActive = !mainRepeatOneIcon.classList.contains("hidden");
    mpRepeatIcon.style.display = oneActive ? "none" : "block";
    mpRepeatOneIcon.style.display = oneActive ? "block" : "none";
    copyFill(mainRepeatIcon, mpRepeatIcon);
    copyFill(mainRepeatOneIcon, mpRepeatOneIcon);
  }

  function syncVolumeState() {
    const mainUnmute = document.getElementById("unmute");
    const mainMute = document.getElementById("mute");
    if (!mainUnmute || !mainMute) return;
    const muted = !mainMute.classList.contains("hidden");
    mpVolumeUnmute.style.display = muted ? "none" : "block";
    mpVolumeMute.style.display = muted ? "block" : "none";
  }

  // * ve lai icon follow theo trang thai cuc bo (mpIsFollowed) - khong dinh gi
  //   toi nut follow cua trang chinh.
  function renderMpFollowIcon() {
    mpFollowCheck.style.display = mpIsFollowed ? "block" : "none";
    mpFollowPlus.style.display = mpIsFollowed ? "none" : "block";
  }

  function syncAllVisualStates() {
    syncShuffleState();
    syncRepeatState();
    syncVolumeState();
    renderMpFollowIcon();
  }

  const mainShuffleIconEl = document.getElementById("shuffle-icon");
  const mainRepeatIconEl = document.getElementById("repeat-icon");
  const mainRepeatOneIconEl = document.getElementById("repeat-one-icon");
  const mainMuteEl = document.getElementById("mute");

  const stateObserver = new MutationObserver(syncAllVisualStates);
  [
    mainShuffleIconEl,
    mainRepeatIconEl,
    mainRepeatOneIconEl,
    mainMuteEl,
  ].forEach((el) => {
    if (el)
      stateObserver.observe(el, {
        attributes: true,
        attributeFilter: ["class", "style", "fill"],
        subtree: true,
      });
  });

  // * dong bo hanh dong voi cac nut goc
  mpPlayBtn.addEventListener("click", () => {
    document.querySelector(".play-button-bg-song")?.click();
  });
  mpPrev.addEventListener("click", () => {
    document.getElementById("prev-song")?.click();
  });
  mpNext.addEventListener("click", () => {
    document.getElementById("next-song")?.click();
  });
  mpShuffle.addEventListener("click", () => {
    document.getElementById("shuffle-btn")?.click();
    pipWindow.requestAnimationFrame(syncShuffleState);
  });
  mpRepeat.addEventListener("click", () => {
    document.getElementById("repeat-btn")?.click();
    pipWindow.requestAnimationFrame(syncRepeatState);
  });
  mpVolume.addEventListener("click", () => {
    document.getElementById("volume-btn")?.click();
    pipWindow.requestAnimationFrame(syncVolumeState);
  });
  mpShare.addEventListener("click", () => {
    document.querySelector(".add-to-playlist")?.click();
  });
  // * follow: chi doi trang thai/mau cuc bo, khong bam ho nut follow cua trang chinh.
  mpFollow.addEventListener("click", () => {
    mpIsFollowed = !mpIsFollowed;
    renderMpFollowIcon();
  });

  mpProgress.addEventListener("input", () => {
    isSeeking = true;
    mpCurrentTime.textContent = formatTime(
      (mpProgress.value / 100) * (audio.duration || 0),
    );
    updateMpProgressBar();
  });
  mpProgress.addEventListener("change", () => {
    if (isFinite(audio.duration)) {
      audio.currentTime = (mpProgress.value / 100) * audio.duration;
    }
    isSeeking = false;
  });

  audio.addEventListener("play", updatePlayIcon);
  audio.addEventListener("pause", updatePlayIcon);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", () => {
    updateMiniPlayerInfo();
    updateProgress();
  });

  updateMiniPlayerInfo();
  updatePlayIcon();
  updateProgress();
  syncAllVisualStates();

  pipWindow.addEventListener("pagehide", () => {
    audio.removeEventListener("play", updatePlayIcon);
    audio.removeEventListener("pause", updatePlayIcon);
    audio.removeEventListener("timeupdate", updateProgress);
    resizeObserver.disconnect();
    stateObserver.disconnect();
    pipWindow = null;
    setMiniPlayerActive(false);
  });
}

if (miniPlayerBtn) {
  miniPlayerBtn.addEventListener("click", openMiniPlayer);
}
