// 1. Danh sách dữ liệu các bài hát
// >>> URL gốc của R2 bucket (thay bằng URL thật của bạn sau khi Enable Public Development URL) <<<
// const R2_BASE = "https://pub-5cee7735d10d4f61896814b089cfc9a8.r2.dev";
const R2_BASE = "/media";
const tracks = [
  {
    stt: 1,
    title: "Elegie",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Elegie_Track01_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Elegie_spotdown.org.mp3",
    duration: "1:27",
  },
  {
    stt: 2,
    title: "IDK",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_IDK_Track02_N0L4B3L.png",
    audio: R2_BASE + "/hvl/IDK_spotdown.org.mp3",
    duration: "3:16",
  },
  {
    stt: 3,
    title: "Wtf Bby I'm Lit",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Wtf_Bby_Im_Lit_Track03_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Wtf_Bby_Im_Lit_spotdown.org.mp3",
    duration: "2:46",
  },
  {
    stt: 4,
    title: "Anh Không Muốn Nó Dễ Dàng",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Anh_Khong_Muon_No_De_Dang_Track04_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Anh_Khong_Muon_No_De_Dang_spotdown.org.mp3",
    duration: "2:45",
  },
  {
    stt: 5,
    title: "Baby (feat. marzuz)",
    artist: "RPT MCK, marzuz",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Baby_Track05_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Baby_feat_marzuz_spotdown.org.mp3",
    duration: "2:53",
  },
  {
    stt: 6,
    title: "Yêu Anh Giết Anh",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Yeu_Anh_Giet_Anh_Track06_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Yeu_Anh_Giet_Anh_spotdown.org.mp3",
    duration: "2:45",
  },
  {
    stt: 7,
    title: "Mắt Môi Tay Chân (feat. Tage)",
    artist: "RPT MCK, Tage",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Mat_Moi_Tay_Chan_Track07_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Mat_Moi_Tay_Chan_feat_Tage_spotdown.org.mp3",
    duration: "3:12",
  },
  {
    stt: 8,
    title: "Đao Của Anh Vừa",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Dao_Cua_Anh_Vua_Track08_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Dao_Cua_Anh_Vua_spotdown.org.mp3",
    duration: "2:04",
  },
  {
    stt: 9,
    title: "Là Gì Của Nhau",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_La_Gi_Cua_Nhau_Track09_N0L4B3L.png",
    audio: R2_BASE + "/hvl/La_Gi_Cua_Nhau_spotdown.org.mp3",
    duration: "2:22",
  },
  {
    stt: 10,
    title: "Night In Prague",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Night_In_Prague_Track10_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Night_In_Prague_spotdown.org.mp3",
    duration: "3:33",
  },
  {
    stt: 11,
    title: "Một Cái Ôm",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Mot_Cai_Om_Track11_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Mot_Cai_Om_spotdown.org.mp3",
    duration: "3:21",
  },
  {
    stt: 12,
    title: "Liệm",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Liem_Track12_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Liem_spotdown.org.mp3",
    duration: "3:53",
  },
  {
    stt: 13,
    title: "Nếu Như Ta Chẳng Còn (feat. A$AP Ướt Mi)",
    artist: "RPT MCK, A$AP Ướt Mi",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Neu_Nhu_Ta_Chang_Con_Track13_N0L4B3L.png",
    audio:
      R2_BASE + "/hvl/Neu_Nhu_Ta_Chang_Con_feat_ ASAP_Uot_Mi_spotdown.org.mp3",
    duration: "5:17",
  },
  {
    stt: 14,
    title: "Ai Mới Là Kẻ Xấu Xa",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Ai_Moi_La_Ke_Xau_Xa_Track14_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Ai_Moi_La_Ke_Xau_Xa_spotdown.org.mp3",
    duration: "3:11",
  },
  {
    stt: 15,
    title: "Slippery (feat. Tùng Dương)",
    artist: "RPT MCK, Tùng Dương",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Slippery_Track15_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Slippery_feat_Tung_Duong_spotdown.org.mp3",
    duration: "3:35",
  },
  {
    stt: 16,
    title: "Interpol",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Intenpol_Track16_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Intenpol_spotdown.org.mp3",
    duration: "0:53",
  },
  {
    stt: 17,
    title: "Tây Thi",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Tay_Thi_Track17_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Tay_Thi_spotdown.org.mp3",
    duration: "1:44",
  },
  {
    stt: 18,
    title: "Hút và Hút",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Hut_Va_Hut_Track18_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Hut_va_Hut_spotdown.org.mp3",
    duration: "2:14",
  },
  {
    stt: 19,
    title: "Dưa Chua",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Dua_Chua_Track19_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Dua_Chua_spotdown.org.mp3",
    duration: "3:02",
  },
  {
    stt: 20,
    title: "Xa Xôi (feat. Obito)",
    artist: "RPT MCK, Obito",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Xa_Xoi_Track20_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Xa_Xoi_feat_Obito_spotdown.org.mp3",
    duration: "3:37",
  },
  {
    stt: 21,
    title: "Che Phủ",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Che_Phu_Track21_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Che_Phu_spotdown.org.mp3",
    duration: "2:35",
  },
  {
    stt: 22,
    title: "Oanh M = Thuoc",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Oanh_M_Thuoc_Track22_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Oanh_M_bang_Thuoc_spotdown.org.mp3",
    duration: "3:24",
  },
  {
    stt: 23,
    title: "Ghet Xog Lai Thik",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Ghet_Xog_Lai_Thik_Track23_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Ghet_Xog_Lai_Thik_spotdown.org.mp3",
    duration: "1:53",
  },
  {
    stt: 24,
    title: "Nhìn Kẻ Thù Của Tao",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Nhin_Ke_Thu_Cua_Tao_Track24_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Nhin_Ke_Thu_Cua_Tao_spotdown.org.mp3",
    duration: "3:54",
  },
  {
    stt: 25,
    title: "Envy (feat. THANHDRAW)",
    artist: "RPT MCK, THANHDRAW",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Envy_Track25_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Envy_feat_Thanh_Draw_spotdown.org.mp3",
    duration: "3:55",
  },
  {
    stt: 26,
    title: "Cảm Ơn",
    artist: "RPT MCK",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Cam_On_Track26_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Cam_On_spotdown.org.mp3",
    duration: "2:39",
  },
  {
    stt: 27,
    title: "Không Cần Lo Cho Tao",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Khong_Can_Lo_Cho_Tao_Track27_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Khong_Can_Lo_Cho_Tao_spotdown.org.mp3",
    duration: "2:36",
  },
  {
    stt: 28,
    title: "Huh (feat. RPT Orijinn & THANHDRAW)",
    artist: "RPT MCK, RPT Orijinn, THANHDRAW",
    img: R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Huh_Track28_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Huh_feat_RPT_Orijinn_Thanh_Draw)_spotdown.org.mp3",
    duration: "4:11",
  },
  {
    stt: 29,
    title: "Nguyễn Văn Mười",
    artist: "RPT MCK",
    img:
      R2_BASE +
      "/assets/tracks/hvl_art/HVL_MCK_Nguyen_Van_Muoi_Track29_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Nguyen_Van_Muoi_spotdown.org.mp3",
    duration: "4:02",
  },
  {
    stt: 30,
    title: "Thịt Lợn",
    artist: "RPT MCK",
    img:
      R2_BASE + "/assets/tracks/hvl_art/HVL_MCK_Thit_Lon_Track30_N0L4B3L.png",
    audio: R2_BASE + "/hvl/Thit_Lon_spotdown.org.mp3",
    duration: "3:48",
  },
];

// Cho next-song.js dùng chung mảng này
window.tracks = tracks;

// Hàng đợi do người dùng tự thêm (lưu index vào mảng tracks, tránh trùng lặp)
window.customQueue = window.customQueue || [];

function addToQueue(index) {
  if (!window.customQueue.includes(index)) {
    window.customQueue.push(index);
  }
  if (typeof window.onQueueChange === "function") window.onQueueChange();
}

function removeFromQueue(index) {
  window.customQueue = window.customQueue.filter((i) => i !== index);
  if (typeof window.onQueueChange === "function") window.onQueueChange();
}

window.addToQueue = addToQueue;
window.removeFromQueue = removeFromQueue;

// 1.5
function randomViews() {
  const rand = Math.random();
  let num;

  if (rand < 0.15) {
    // 15% bài hot: 1,000,000 - 20,000,000
    num = Math.floor(Math.random() * (20_000_000 - 1_000_000) + 1_000_000);
  } else if (rand < 0.55) {
    // 40% bài trung bình: 100,000 - 1,000,000
    num = Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000);
  } else {
    // 45% bài ít nghe: 1,000 - 100,000
    num = Math.floor(Math.random() * (100_000 - 1_000) + 1_000);
  }

  return num.toLocaleString("en-US"); // 1234567 -> "1,234,567"
}

tracks.forEach((track) => {
  track.views = randomViews();
});

// 2. Tiện ích format giây -> "m:ss"
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// 3. Hàm chuyển đổi 1 đối tượng track thành chuỗi HTML
function createTrackHTML(track, index) {
  const hasMv = !!(window.mvDatabase && window.mvDatabase[track.title]);
  const mvIconHTML = hasMv
    ? `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="shrink-0" viewBox="0 0 16 16" width="14" height="14">
        <path d="M11.196 8 6 5v6l5.196-3z" fill="#BCBCC1"></path>
        <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z" fill="#BCBCC1"></path>
      </svg>`
    : "";
  return `
    <!-- * track ${track.stt} -->
    <li
      data-index="${index}"
      class="group justify-normal items-center gap-4 grid grid-cols-[22px_2fr_1fr_50px_auto] hover:bg-[#282831] px-[16px] py-[8px] rounded track-main"
    >
      <!-- * stt -->
      <div class="flex justify-center items-center w-[22px] h-full stt-play">
        <span class="px-2 text-[#989FB9] text-md track-stt">${track.stt}</span>

        <div class="hidden playing track-playing-icon">
          <div class="greenline line-1"></div>
          <div class="greenline line-2"></div>
          <div class="greenline line-3"></div>
          <div class="greenline line-4"></div>
          <div class="greenline line-5"></div>
        </div>

        <span class="hidden track-play-icon cursor-pointer">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" fill="#FFFFFF"></path>
          </svg>
        </span>

        <span class="hidden track-pause-icon cursor-pointer">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z" fill="#FFFFFF"></path>
          </svg>
        </span>
      </div>

      <!-- * img + title -->
      <div class="flex justify-start items-center gap-2 h-full min-w-0">
        <div class="w-[40px] min-w-[40px] h-[40px]">
          <img src="${track.img}" alt="${track.title}" class="rounded" loading="lazy" decoding="async"/>
        </div>
        <div class="min-w-0">
          <span class="block text-md text-white track-title hover:underline text-nowrap overflow-hidden text-ellipsis hover:cursor-pointer">${track.title}</span>
          ${
            track.artist
              ? `<span class="flex items-center gap-1 text-sm text-[#989FB9]">
                  ${mvIconHTML}
                  <span class="text-nowrap overflow-hidden text-ellipsis">${track.artist}</span>
                </span>`
              : ""
          }
        </div>
      </div>

      <!-- * view -->
      <div class="hidden sm:flex justify-end items-center h-full">
        <span class="text-[#B8B8B8] text-sm">${track.views ?? ""}</span>
      </div>

      <div></div>

      <!-- * time + actions -->
      <div class="flex justify-end items-center h-full">
        <div class="flex items-center gap-2">
          <!-- * add to playlist -->
          <div class="relative add-to-playlist py-2 cursor-pointer need-description">
            <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out" viewBox="0 0 16 16" width="16" height="16">
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" fill="#1ED78B"></path>
            </svg>
            <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="hidden hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out" viewBox="0 0 24 24" width="16" height="16">
              <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z" fill="#CDD6F4"></path>
              <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z" fill="#CDD6F4"></path>
            </svg>
            <span class="hidden z-50 absolute bg-gray-700 opacity-0 mt-[-55px] ml-[-45px] px-[5px] py-[3px] rounded text-white text-sm text-nowrap transition-all translate-y-2 duration-500 ease-in-out transform description">Add to playlist</span>
          </div>

          <!-- * time -->
          <div class="sm:m-0 mr-2 w-[4ch] sm:w-[5ch] text-right">
            <span class="text-[#989FB9] text-sm track-time">${track.duration}</span>
          </div>

          <!-- * 3 dots -->
          <div class="hidden sm:block relative track-more">
            <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" class="track-more-toggle group relative opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer need-description" viewBox="0 0 24 24" width="22" height="22">
              <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill-opacity="1" fill="#fff"></path>
            </svg>
            <span class="hidden z-50 absolute bg-gray-700 opacity-0 mt-[-60px] ml-[-150px] px-[5px] py-[3px] rounded text-white text-sm text-nowrap transition-all translate-y-2 duration-500 ease-in-out transform description">More options for this track</span>

            <!-- * popup: add / remove queue -->
            <div class="hidden right-0 top-full z-50 absolute bg-[#282828] shadow-xl mt-1 rounded-md w-[230px] overflow-hidden track-more-menu">
              <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer track-add-queue">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M16 15H2v-1.5h14zm0-4.5H2V9h14zm-8.034-6A5.5 5.5 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2z" fill="#B3B3B3"></path>
                </svg>
                <span class="text-white text-sm">Thêm vào hàng đợi</span>
              </button>
              <button type="button" class="flex items-center gap-3 hover:bg-[#3E3E3E] px-3 py-2 w-full text-left cursor-pointer track-remove-queue">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" fill="#B3B3B3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583M2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z" fill="#B3B3B3"></path>
                </svg>
                <span class="text-white text-sm">Xóa khỏi hàng đợi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

// 4. Render danh sách ra giao diện — chỉ hiện 5 bài đầu, phần còn lại
// chỉ thực sự render (và do đó chỉ thực sự tải ảnh) khi bấm "See more".
const playlistContainer = document.getElementById("playlist");
const INITIAL_COUNT = 5;
let seeMoreExpanded = false;

function renderPlaylist(expanded) {
  const list = expanded ? tracks : tracks.slice(0, INITIAL_COUNT);
  playlistContainer.innerHTML = list
    .map((track, i) => createTrackHTML(track, i))
    .join("");
}

renderPlaylist(false); // lần đầu: chỉ 5 bài -> chỉ 5 request ảnh

const seeMoreBtn = document.getElementById("see-more");
if (seeMoreBtn) {
  const seeMoreLabel = seeMoreBtn.querySelector("span");
  seeMoreBtn.addEventListener("click", () => {
    seeMoreExpanded = !seeMoreExpanded;
    renderPlaylist(seeMoreExpanded);
    if (seeMoreLabel) {
      seeMoreLabel.textContent = seeMoreExpanded ? "See less" : "See more";
    }
  });
}

// 5. KHÔNG tải trước bất kỳ file audio nào để lấy duration.
// Duration chỉ được cập nhật từ audio THẬT khi người dùng bấm nghe
// (audio#audio-song đã được gán src bởi playTrackAtIndex ở file khác).
const audioElForDuration = document.getElementById("audio-song");
if (audioElForDuration) {
  audioElForDuration.addEventListener("loadedmetadata", () => {
    const index =
      typeof window.getCurrentTrackIndex === "function"
        ? window.getCurrentTrackIndex()
        : null;
    if (index === null || !tracks[index]) return;

    tracks[index].duration = formatTime(audioElForDuration.duration);
    const timeEl = document.querySelector(
      `.track-main[data-index="${index}"] .track-time`,
    );
    if (timeEl) timeEl.textContent = tracks[index].duration;
  });
}

// 6. Click vào 1 dòng track -> phát bài đó (trừ khi bấm add-to-playlist / 3 chấm)
playlistContainer.addEventListener("click", (e) => {
  // * mo/dong popup more-options
  const moreToggle = e.target.closest(".track-more-toggle");
  if (moreToggle) {
    e.stopPropagation();
    const menu = moreToggle
      .closest(".track-more")
      .querySelector(".track-more-menu");
    document.querySelectorAll(".track-more-menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden");
    });
    menu.classList.toggle("hidden");
    return;
  }

  // * them vao hang doi
  const addBtn = e.target.closest(".track-add-queue");
  if (addBtn) {
    e.stopPropagation();
    const trackEl = addBtn.closest(".track-main");
    window.addToQueue(Number(trackEl.dataset.index));
    addBtn.closest(".track-more-menu").classList.add("hidden");
    return;
  }

  // * xoa khoi hang doi
  const removeBtn = e.target.closest(".track-remove-queue");
  if (removeBtn) {
    e.stopPropagation();
    const trackEl = removeBtn.closest(".track-main");
    window.removeFromQueue(Number(trackEl.dataset.index));
    removeBtn.closest(".track-more-menu").classList.add("hidden");
    return;
  }

  if (e.target.closest(".add-to-playlist") || e.target.closest(".track-more"))
    return;

  const track = e.target.closest(".track-main");
  if (!track) return;

  const index = Number(track.dataset.index);
  if (typeof window.playTrackAtIndex === "function") {
    window.playTrackAtIndex(index);
  }
});

// * dong popup more-options khi click ra ngoai
document.addEventListener("click", (e) => {
  if (!e.target.closest(".track-more")) {
    document
      .querySelectorAll(".track-more-menu")
      .forEach((m) => m.classList.add("hidden"));
  }
});

// 8. Áp dụng marquee cho tên bài trong danh sách (chạy khi hover dòng đó)
document.querySelectorAll(".track-title").forEach((el) => {
  const text = el.textContent.trim();
  setupMarquee(el, text, { always: false });
});

// 7. Đánh dấu bài đang phát trong danh sách (đổi số thứ tự + tên bài sang màu xanh)
function highlightPlayingTrack(index) {
  document.querySelectorAll(".track-main.is-playing").forEach((el) => {
    el.classList.remove("is-playing");
  });

  const active = document.querySelector(`.track-main[data-index="${index}"]`);
  if (!active) return;

  active.classList.add("is-playing");
}
window.highlightPlayingTrack = highlightPlayingTrack;
