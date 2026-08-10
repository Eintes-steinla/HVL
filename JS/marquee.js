/**
 * Biến 1 phần tử chứa text tĩnh thành marquee NẾU text bị tràn khung chứa.
 * @param {HTMLElement} el - phần tử sẽ chứa marquee (phải nằm trong khung có chiều rộng giới hạn)
 * @param {string} text - nội dung cần hiển thị
 * @param {{ always?: boolean }} options - always: true = chạy liên tục, false = chỉ chạy khi hover .track-main cha
 */
function setupMarquee(el, text, { always = false } = {}) {
  el.innerHTML = "";
  el.classList.remove(
    "text-ellipsis",
    "overflow-hidden",
    "marquee-viewport",
    "marquee-always",
  );

  const viewport = document.createElement("span");
  viewport.className = "block";
  const track = document.createElement("span");
  track.style.display = "inline-block";
  track.textContent = text;
  viewport.appendChild(track);
  el.appendChild(viewport);

  requestAnimationFrame(() => {
    const overflow = track.scrollWidth > el.clientWidth + 1;

    if (!overflow) {
      // Không tràn -> hiển thị bình thường, cắt bằng dấu "..."
      el.classList.add("text-ellipsis", "overflow-hidden");
      return;
    }

    // Tràn -> nhân đôi nội dung để chạy vòng lặp mượt (không giật khi lặp lại)
    const gap = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
    const span1 = document.createElement("span");
    span1.textContent = text + gap;
    const span2 = document.createElement("span");
    span2.textContent = text + gap;

    track.textContent = "";
    track.className = "marquee-track";
    track.appendChild(span1);
    track.appendChild(span2);

    const distance = span1.scrollWidth;
    const speed = 1; // px/giây, chỉnh để nhanh/chậm hơn
    const duration = Math.max(distance / speed, 4);
    track.style.setProperty("--marquee-duration", `${duration}s`);

    el.classList.add("marquee-viewport");
    if (always) el.classList.add("marquee-always");
  });
}
