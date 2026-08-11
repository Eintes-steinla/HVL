(function () {
  if (!("mediaSession" in navigator)) return; // trình duyệt không hỗ trợ thì bỏ qua

  const audio = document.getElementById("audio-song");
  if (!audio) return;

  // Cập nhật ảnh + tên bài + nghệ sĩ trên notification/lock screen
  function updateMetadata() {
    const list = window.tracks || [];
    const index =
      typeof window.getCurrentTrackIndex === "function"
        ? window.getCurrentTrackIndex()
        : 0;
    const track = list[index];
    if (!track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist || "",
      album: "HVL",
      artwork: [
        { src: track.img, sizes: "96x96", type: "image/png" },
        { src: track.img, sizes: "192x192", type: "image/png" },
        { src: track.img, sizes: "256x256", type: "image/png" },
        { src: track.img, sizes: "384x384", type: "image/png" },
        { src: track.img, sizes: "512x512", type: "image/png" },
      ],
    });
  }

  // Đăng ký hành động cho các nút trên notification
  navigator.mediaSession.setActionHandler("play", () => {
    audio.play();
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    audio.pause();
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    if (typeof window.prevSongFromMediaSession === "function") {
      window.prevSongFromMediaSession();
    } else {
      document.getElementById("prev-song")?.click();
    }
  });

  navigator.mediaSession.setActionHandler("nexttrack", () => {
    if (typeof window.nextSongFromMediaSession === "function") {
      window.nextSongFromMediaSession();
    } else {
      document.getElementById("next-song")?.click();
    }
  });

  // Đồng bộ trạng thái play/pause thật của audio -> notification
  audio.addEventListener("play", () => {
    navigator.mediaSession.playbackState = "playing";
    updateMetadata();
  });

  audio.addEventListener("pause", () => {
    navigator.mediaSession.playbackState = "paused";
  });

  // Mỗi khi đổi bài (src thay đổi) -> cập nhật lại metadata ngay
  audio.addEventListener("loadedmetadata", updateMetadata);

  // Thanh tiến trình trên lock screen (một số trình duyệt hỗ trợ)
  audio.addEventListener("timeupdate", () => {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    } catch (e) {
      // một số trình duyệt không hỗ trợ setPositionState, bỏ qua lỗi
    }
  });
})();
