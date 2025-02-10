import * as util from "./util.js";

const imgUrl = util.imgUrl;

(function navEvents() {
  if(util.query) {
    document.querySelector(".search-form input").value = util.query;
  }

  document.querySelector(".cart-button").addEventListener("click", (e) => {
    const cartMenu = document.querySelector(".cart-menu");
    if (!cartMenu.classList.contains("active")) {
      updateCartMenu();
      cartMenu.classList.add("active");
      util.createFullPageOverlay(false);
    } else {
      cartMenu.classList.remove("active");
      util.removeFullPageOverlay();
    }
  });

  document.querySelector(".view-cart-button").addEventListener("click", (e) => {
    const cartMenu = document.querySelector(".cart-menu");
    cartMenu.classList.remove("active");
  });

  document.querySelector(".search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search");
    window.location.href = `catalog.html?query=${searchInput.value}`;
  }); 

  util.updateCartAlert();
})();

(function footerImageUpdate() {
  const images = document.querySelectorAll("footer img");
  images.forEach((img) => {
    // img.src = `${imgUrl}/${img.getAttribute("imgName")}`;
  });
})();

(function scrollToTopEvent() {
  document.querySelector(".scroll-to-top").addEventListener("click", util.scrollToTop);
})();

function updateCartMenu() {
  const cartMenu = document.querySelector(".cart-menu");
  const cartItems = document.querySelector(".cart-items");

  document.addEventListener("click", function closeCart(e) {
    if (!cartMenu.contains(e.target) && !e.target.closest(".cart-button")) {
      cartMenu.classList.remove("active");
      util.removeFullPageOverlay();
      document.removeEventListener("click", closeCart);
    }
  });

  const cartMenuOverlay = document.querySelector(".cart-menu-overlay");
  cartMenuOverlay.classList.add("active");

  fetch("/api/cart")
    .then((response) => response.json())

    .then((cartJson) => {
      cartItems.innerHTML = "";
      if (cartJson && cartJson.length > 0) {
        createCartItems(cartJson, cartItems);
        document.querySelector(".cart-footer").classList.add("visible");
      } else {
        cartItems.innerHTML = '<div class="empty-cart">No items in your cart yet. Start shopping!</div>';
        document.querySelector(".cart-footer").classList.remove("visible");
      }
    })
    .catch((err) => {
      console.error("Failed to fetch cart:", err);
      cartItems.innerHTML = '<div class="cart-error">Failed to load cart</div>';
    })
    .finally(() => {
      cartMenuOverlay.classList.remove("active");
      util.updateCartAlert();
    });
}

function createCartItems(cart, cartItems) {
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("data-id", item.id);
    cartItem.innerHTML = `
      <a href="product.html?id=${item.id}" target="_blank" class="cart-item-link">
        <div class="cart-item-thumbnail">
          <img src="${imgUrl}/product/${item.image}" alt="Product ${item.title} thumbnail">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.title}</div>
          <div class="cart-item-price">Price: ${item.price} <span class="currency">EGP</span></div>
          <div class="cart-item-quantity">Quantity: ${item.quantity} item(s)</div>
          <div class="cart-item-actions">
            <button class="cart-item-remove">Remove</button>
          </div>
        </div>
      </a>
    `;

    cartItems.appendChild(cartItem);

    cartItem.querySelector(".cart-item-remove").addEventListener("click", (e) => {
      e.preventDefault();
      const cartItem = e.target.closest(".cart-item");
      const itemId = cartItem.getAttribute("data-id");
      const cartMenuOverlay = document.querySelector(".cart-menu-overlay");
      cartMenuOverlay.classList.add("active");

      util.callDeleteAPI(
        { id: itemId },
        () => {
          cartItem.remove();
          cartMenuOverlay.classList.remove("active");
          updateCartMenu();

          const productDiv = document.querySelector(`.product[data-id="${itemId}"]`);
          if (productDiv) {
            const addToCart = productDiv.querySelector(".add-to-cart");
            util.activateCartElement(productDiv, addToCart);
          }
        },
        (err) => {
          console.error(err);
          cartMenuOverlay.classList.remove("active");
        }
      );
    });
  });
}

util.updateUserAvatars();