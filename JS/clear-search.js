const input = document.getElementById("input-1");
const clearBtn = document.getElementById("clear-x-1");

// Lắng nghe sự kiện focus vào ô input để hiển thị dấu X
input.addEventListener("focus", () => {
  clearBtn.classList.remove("hidden");
  playholder.classList.add("hidden");
});

// Khi nhấn vào dấu X, xóa hết nội dung trong ô input
clearBtn.addEventListener("click", () => {
  input.value = "";
  clearBtn.classList.add("hidden"); // Ẩn dấu X sau khi xóa chữ
  playholder.classList.remove("hidden");
});

// Khi rời khỏi ô input (blur), dấu X sẽ ẩn đi nếu ô input rỗng
input.addEventListener("blur", () => {
  if (input.value.trim() === "") {
    clearBtn.classList.add("hidden");
    playholder.classList.remove("hidden");
  }
});

// * clear search 2

const input1 = document.getElementById("input-2");
const clearBtn1 = document.getElementById("clear-x-2");

// Lắng nghe sự kiện focus vào ô input để hiển thị dấu X
input1.addEventListener("focus", () => {
  clearBtn1.classList.remove("hidden");
});

// Khi nhấn vào dấu X, xóa hết nội dung trong ô input
clearBtn1.addEventListener("click", () => {
  input1.value = "";
  clearBtn1.classList.add("hidden"); // Ẩn dấu X sau khi xóa chữ
});

// Khi rời khỏi ô input (blur), dấu X sẽ ẩn đi nếu ô input rỗng
input1.addEventListener("blur", () => {
  if (input1.value.trim() === "") {
    clearBtn1.classList.add("hidden");
  }
});

document.addEventListener("click", (e) => {
  e.stopPropagation();
  clearBtn1.classList.add("hidden");
});
// * playholder
const playholder = document.getElementById("input-playholder");
playholder.addEventListener("click", () => {
  playholder.classList.add("hidden");
  input.focus();
});

function updateSpanContent() {
  if (input.offsetWidth === 130) {
    playholder.textContent = "What do you want...";
  } else {
    playholder.textContent = "What do you want to play?";
  }
}
updateSpanContent();
// Gọi hàm khi resize cửa sổ
window.addEventListener("resize", updateSpanContent);

// Dùng ResizeObserver để theo dõi thay đổi kích thước của input
new ResizeObserver(updateSpanContent).observe(
  document.getElementById("input-1")
);
