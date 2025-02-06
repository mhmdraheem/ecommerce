//const imgUrl = "https://e5fzq08qnffeagrv.public.blob.vercel-storage.com";
const imgUrl = "http://localhost:3000/img";
let cart = [];

function createNav() {
  const nav = document.createElement("nav");
  nav.className = "section-margin";

  nav.innerHTML = `
    <div class="container">
      <div class="header">
        <a href="index.html" class="logo">
          <h1>Shoppify</h1>
          <p>One-click shopping</p>
        </a>
        <form action="search.html" method="get" target="_blank">
          <input type="text" placeholder="Search products" name="query" id="search" />
          <button type="submit">Search</button>
        </form>
        <div class="cart-dropdown">
          <button class="cart-button">
            <i class="fa-solid fa-cart-shopping cart-menu-icon">
              <span class="alert"></span>
            </i>
          </button>
          <div class="cart-menu">
            <div class="cart-items">
              <!-- Cart items will be inserted here dynamically -->
            </div>
            <div class="cart-footer">
              <a href="cart.html" target="_blank" class="view-cart-button">View Cart</a>
            </div>
          </div>
        </div>
        <a href="profile.html" target="_blank" class="profile">
          <img class="avatar" src='${imgUrl}/avatar.png' alt="profile-picture" />
        </a>
      </div>
    </div>
  `;

  document.body.prepend(nav);
  document.querySelector(".cart-button").addEventListener("click", (e) => {
    const cartMenu = document.querySelector(".cart-menu");
    if (!cartMenu.classList.contains("active")) {
      updateCartMenu();
      cartMenu.classList.add("active");
    } else {
      cartMenu.classList.remove("active");
    }
  });

  updateCartMenu();
}

function updateCartMenu() {
  const cartMenu = document.querySelector(".cart-menu");
  const cartItems = document.querySelector(".cart-items");
  const alert = document.querySelector(".cart-button .alert");

  document.addEventListener("click", function closeCart(e) {
    if (!cartMenu.contains(e.target) && !e.target.closest(".cart-button")) {
      cartMenu.classList.remove("active");
      document.removeEventListener("click", closeCart);
    }
  });

  fetch("/api/cart")
    .then((response) => response.json())
    .then((cartJson) => {
      cartItems.innerHTML = "";
      cart = cartJson;

      if (cartJson && cartJson.length > 0) {
        alert.classList.add("visible");
        createCartItems(cartJson, cartItems);
      } else {
        alert.classList.remove("visible");
        cartItems.innerHTML = '<div class="empty-cart">No items in your cart yet. Start shopping!</div>';
      }
    })
    .catch((err) => {
      console.error("Failed to fetch cart:", err);
      cartItems.innerHTML = '<div class="cart-error">Failed to load cart</div>';
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
          <div class="cart-item-quantity" data-quantity="${item.quantity}">Quantity: ${item.quantity} item(s)</div>
        </div>
      </a>
    `;

    cartItems.appendChild(cartItem);
  });
}

function createFooterArea() {
  const footerArea = document.createElement("div");
  footerArea.className = "footer-area";

  footerArea.innerHTML = `
    <div class="content">
      <div class="footer-col contact-us-col">
        <h3 class="footer-col-header">Contact Us</h3>
        <div class="contact-us">
          <div class="summary">
            Hi, we are always open for cooperation and suggestions, contact us in one of the ways below
          </div>
          <address>
            <div class="address-type footer-col-header">Phone Number</div>
            <div class="address-value">+1 (800) 060-07-30</div>
          </address>
          <address>
            <div class="address-type footer-col-header">Email Address</div>
            <div class="address-value">us@example.com</div>
          </address>
          <address>
            <div class="address-type footer-col-header">Our Location</div>
            <div class="address-value">
              715 Fake Street, New York<br />
              10012 USA
            </div>
          </address>
          <address>
            <div class="address-type footer-col-header">Working Hours</div>
            <div class="address-value">Mon-Sat 10:00am - 07:00pm</div>
          </address>
        </div>
      </div>
      <div class="footer-col information-col">
        <h3 class="footer-col-header">Information</h3>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Delivery Information</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Brands</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Refunds</a></li>
          <li><a href="#">Site Map</a></li>
        </ul>
      </div>
      <div class="footer-col my-account-col">
        <h3 class="footer-col-header">My Account</h3>
        <ul>
          <li><a href="#">Store Location</a></li>
          <li><a href="#">Order History</a></li>
          <li><a href="#">Wish List</a></li>
          <li><a href="#">Newsletter</a></li>
          <li><a href="#">Special Offers</a></li>
          <li><a href="#">Gift Certificates</a></li>
          <li><a href="#">Affiliate</a></li>
        </ul>
      </div>
      <div class="footer-col newsletter-col">
        <h3 class="footer-col-header">Newsletter</h3>
        <div class="newsletter">
          <form action="#">
            <div class="form-description">
              Enter your email address below to subscribe to our newsletter and keep up to date with discounts and
              special offers
            </div>
            <input type="text" id="email-input" name="email" placeholder="user@example.com" />
            <input type="submit" value="Subscribe" />
          </form>
          <ul class="social-media-links">
            <div class="description">Follow us on social media networks</div>
            <li>
              <a href="https://www.facebook.com" target="_blank">
                <i class="icon icon-facebook fa-brands fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://www.twitter.com" target="_blank">
                <i class="icon icon-twitter fa-brands fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com" target="_blank">
                <i class="icon icon-youtube fa-brands fa-youtube"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank">
                <i class="icon icon-instagram fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <i class="icon icon-rss fa-solid fa-rss"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(footerArea);
}

function createFooter() {
  const footer = document.createElement("footer");

  footer.innerHTML = `
    <div class="content">
      <span>Powered By <a href="#">Tech</a> - Designed by <a href="#">Mohamed Raheem</a></span>
      <span>
        <img src='${imgUrl}/visa.jpg' alt="payment-method-visa" />
        <img src='${imgUrl}/paypal.png' alt="payment-method-paypal" />
        <img src='${imgUrl}/mastercard.png' alt="payment-method-mastercard" />
        <img src='${imgUrl}/westernunion.webp' alt="payment-method-westernunion" />
      </span>
    </div>
  `;

  document.body.appendChild(footer);
}

function createScrollToTop() {
  const scrollToTop = document.createElement("span");
  scrollToTop.className = "scroll-to-top";

  scrollToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';

  scrollToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  document.body.appendChild(scrollToTop);
}

createNav();
createFooterArea();
createFooter();
createScrollToTop();
