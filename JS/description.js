const activeTimeouts = new WeakMap(); // lưu timeout riêng cho từng description

function getDescription(needDescription) {
  // 1. .description là con/cháu bên trong (trường hợp track: add-to-playlist, 3-dots)
  const child = needDescription.querySelector(".description");
  if (child) return child;

  // 2. .description là anh em ngay sau (sibling)
  if (needDescription.nextElementSibling?.classList.contains("description")) {
    return needDescription.nextElementSibling;
  }

  // 3. .description nằm trong cùng 1 wrapper cha gần nhất
  const parent = needDescription.parentElement;
  if (parent) {
    const inParent = parent.querySelector(".description");
    if (inParent) return inParent;
  }

  return null;
}

document.addEventListener("pointerover", (e) => {
  const needDescription = e.target.closest(".need-description");
  if (!needDescription) return;
  if (needDescription.contains(e.relatedTarget)) return; // đã ở trong rồi, bỏ qua

  const description = getDescription(needDescription);
  if (!description) return;

  description.classList.remove("hidden");

  const timeout = setTimeout(() => {
    description.classList.remove("opacity-0", "translate-y-2");
    description.classList.add("opacity-80", "translate-y-0");
  }, 200);

  activeTimeouts.set(description, timeout);
});

document.addEventListener("pointerout", (e) => {
  const needDescription = e.target.closest(".need-description");
  if (!needDescription) return;
  if (needDescription.contains(e.relatedTarget)) return; // vẫn còn ở trong, bỏ qua

  const description = getDescription(needDescription);
  if (!description) return;

  clearTimeout(activeTimeouts.get(description));

  description.classList.remove("opacity-80", "translate-y-0");
  description.classList.add("opacity-0", "translate-y-2");

  setTimeout(() => {
    if (description.classList.contains("opacity-0")) {
      description.classList.add("hidden");
    }
  }, 500);
});
