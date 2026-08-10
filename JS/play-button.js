// play-button-bg (click để check/uncheck)
document.addEventListener("click", (e) => {
  const button = e.target.closest(".play-button-bg");
  if (!button) return;

  const songCheckbox = button.querySelector(".play-button-song input");

  if (songCheckbox) {
    const isChecked = songCheckbox.checked;
    document.querySelectorAll(".play-button-song input").forEach((checkbox) => {
      checkbox.checked = !isChecked;
    });
  } else {
    const checkbox = button.querySelector(".play-button input");
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
});

// space play song - giữ nguyên, không liên quan render động
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();

    let audio = document.getElementById("audio-song");
    let allLabels = document.querySelectorAll(".play-button-song input");

    if (audio.paused) {
      audio.play();
      allLabels.forEach((input) => (input.checked = false));
    } else {
      audio.pause();
      allLabels.forEach((input) => (input.checked = true));
    }
  }
});
