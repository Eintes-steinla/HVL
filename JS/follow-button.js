document.getElementById("follow-button").addEventListener("click", function () {
  const span = this.querySelector("span");
  span.textContent = span.textContent === "Following" ? "Follow" : "Following";
});

document
  .getElementById("follow-button-about")
  .addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });

document
  .getElementById("follow-button-credits")
  .addEventListener("click", function () {
    const span = this.querySelector("span");
    span.textContent = span.textContent === "Unfollow" ? "Follow" : "Unfollow";
  });
