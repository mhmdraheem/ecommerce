// export const imgUrl = "https://e5fzq08qnffeagrv.public.blob.vercel-storage.com";
export const imgUrl = "http://localhost:3000/img";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
export const query = params.get('query');

export function callDeleteAPI(product, onSuccess, onError) {
  fetch(`/api/cart/${product.id}`, {
    method: "DELETE",
  })
    .then((response) => toJson(response))
    .then(onSuccess)
    .catch(onError);
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export function showErrorToast() {
  Swal.fire({
    text: "Something went wrong!",
    position: "top-end",
    background: "#000",
    color: "#fff",
    width: "fit-content",
    showConfirmButton: false,
    timer: 1500,
    toast: true,
  });
}

export function createFullPageOverlay(showSpinner = true) {
  const overlay = document.createElement("div");
  overlay.classList.add("page-overlay");
  overlay.style.top = document.querySelector("nav").offsetHeight + "px";

  const spinner = document.createElement("i");
  spinner.classList.add("fa-solid", "fa-spinner", "fa-spin", "page-overlay-spinner");

  if (showSpinner) {
    overlay.appendChild(spinner);
  }
  document.body.appendChild(overlay);
}

export function removeFullPageOverlay() {
  if (document.querySelector(".page-overlay")) {
    document.querySelector(".page-overlay").remove();
  }
}

export function toJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("API error occured");
  }
}

export function activateCartElement(productDiv, element) {
  productDiv.querySelectorAll(".cart-add-wrapper").forEach((wrapper) => {
    wrapper.classList.remove("active");
  });
  element.classList.add("active");
}

export function updateCartAlert() {
  const alert = document.querySelector(".cart-button .alert");
  fetch("/api/cart/count")
    .then((response) => response.json())
    .then((count) => {
      if (count > 0) {
        alert.classList.add("visible");
      } else {
        alert.classList.remove("visible");
      }
    })
    .catch((err) => {
      console.error("Failed to fetch cart count:", err);
      alert.classList.remove("visible");
    });
}

export function getUserProfile() {
  return fetch("/api/profile")
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => {
      console.error("Failed to get profile:", err);
      return null;
    });
}

export function updateUserAvatars() {
  getUserProfile().then((profile) => {
    const avatarValue = profile.avatar || `${imgUrl}/avatar.png`;
    document.querySelectorAll(".user-avatar").forEach(avatar => {
      avatar.src = avatarValue;
    });
  });
}