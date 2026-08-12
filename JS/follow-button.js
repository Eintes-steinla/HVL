const followButton = document.getElementById("follow-button");
if (followButton) {
  followButton.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent =
      span.textContent === "Following" ? "Follow" : "Following";
  });
}

const followButtonAbout = document.getElementById("follow-button-about");
if (followButtonAbout) {
  followButtonAbout.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });
}

const followButtonCredits = document.getElementById("follow-button-credits");
if (followButtonCredits) {
  followButtonCredits.addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });
}
