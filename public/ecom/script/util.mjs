// export const imgUrl = "https://e5fzq08qnffeagrv.public.blob.vercel-storage.com";
export const imgUrl = "../ecom/img";

let url = new URL(window.location.href);
let searchParams = new URLSearchParams(url.search);

export const queryParams = getQueryParams();

export function getQueryParams() {
  return searchParams;
}

export function callDeleteAPI(product, onSuccess, onError) {
  fetch(`/ecom/api/cart/${product.id}`, {
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

export function showSucessToast(message) {
  Swal.fire({
    text: message,
    position: "top-end",
    background: "green",
    color: "#fff",
    width: "fit-content",
    showConfirmButton: false,
    timer: 1500000,
    toast: true,
  });
}

export function showAddedToCartToast() {
  Swal.fire({
    icon: "success",
    text: "Item added to cart",
    position: "bottom",
    background: "green",
    color: "#fff",
    width: "50%",
    showConfirmButton: false,
    timer: 3000,
    toast: true,
    showClass: {
      popup: `
      animate__slideInUp
    `,
    },
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
    overlay.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
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
  fetch("/ecom/api/cart/count")
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
  return fetch("/ecom/api/profile")
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => {
      console.error("Failed to get profile:", err);
      return null;
    });
}

export function updateAvatar(avatarElem) {
  getUserProfile().then((profile) => {
    if (profile.avatar) {
      avatarElem.src = `data:${profile.avatar.mimeType};base64,${profile.avatar.base64Image}`;
    } else {
      avatarElem.src = `${imgUrl}/avatar.png`;
    }
  });
}

export function generateStars(rating, includeReviews = false) {
  const starsContainer = document.createElement("span");

  if (includeReviews) {
    const stars = document.createElement("span");
    stars.classList.add("revirew-stars");
    stars.textContent = `${rating.stars}`;
    starsContainer.appendChild(stars);
  }

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("rating-star", "fa-solid");

    if (i <= Math.floor(rating.stars)) {
      star.classList.add("colored--golden", "fa-star");
    } else if (i - rating.stars < 1) {
      star.classList.add("colored--golden", "fa-star-half-stroke");
    } else {
      star.classList.add("colored--grey", "fa-star");
    }

    starsContainer.appendChild(star);
  }

  if (includeReviews) {
    const reviews = document.createElement("span");
    reviews.classList.add("reviews-count");
    reviews.textContent = ` (${rating.reviews})`;
    starsContainer.appendChild(reviews);
  }
  return starsContainer;
}

(function navEvents() {
  if (queryParams.get("name")) {
    document.querySelector(".search-form input").value = queryParams.get("name");
  }

  updateAvatar(document.querySelector("nav .user-avatar"));

  document.querySelector(".search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search");
    window.location.href = `../ecom/catalog.html?name=${searchInput.value}`;
  });

  updateCartAlert();
})();

(function scrollToTopEvent() {
  document.querySelector(".scroll-to-top").addEventListener("click", scrollToTop);
})();

export function formatPrice(price) {
  return price.toLocaleString("en-us", { maximumFractionDigits: 2 });
}
