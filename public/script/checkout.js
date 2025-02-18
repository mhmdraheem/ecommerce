import * as util from "./util.js";
import * as addToCart from "./add-to-cart.js";

let subtotal = 0;
(async function getCartItems() {
  fetch("/api/profile")
    .then((response) => response.json())
    .then((profile) => {
      renderInfoSection(profile);
      renderOrderSummaryCard();
      renderItemsSection();
    })
    .catch((err) => {
      console.error("Failed to fetch profile data:", err);
      util.showErrorToast();
    });
})();

function renderInfoSection(profile) {
  const pageHeader = document.querySelector(".page-header");
  pageHeader.textContent = "Place your order";

  const shippingInfoHeader = document.querySelector(".shipping-info-header");
  shippingInfoHeader.classList.remove("hidden");

  const shippingInfoContent = document.querySelector(".shipping-info-content");
  if (profile) {
    const personalInfo = profile.personalInfo;
    const address = profile.address;
    const payment = profile.paymentMethod;

    shippingInfoContent.querySelector(".line-1 p").textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
    shippingInfoContent.querySelector(".line-1 a span").textContent = "edit";
    shippingInfoContent.querySelector(".line-1 a i").classList.add("fa-solid", "fa-chevron-right", "arrow");
    shippingInfoContent.querySelector(
      ".address"
    ).textContent = `${address.addressLine1} ${address.addressLine2} ${address.country}, ${address.city}, ${address.zipCode} | ${personalInfo.email} | ${personalInfo.phone}`;

    if (payment.type === "COD") {
      shippingInfoContent.querySelector(".payment").textContent = `Payment via: cash on delivery`;
    } else {
      shippingInfoContent.querySelector(
        ".payment"
      ).textContent = `Payment via: card ending with ${payment.cardNumber.substr(-4)}`;
    }
  } else {
    shippingInfoContent.querySelector(".line-1 p").textContent = `Please add your personal information.`;
    shippingInfoContent.querySelector(".line-1 a span").textContent = "add";
    shippingInfoContent.querySelector(".line-1 a i").classList.add("fa-solid", "fa-plus");
  }
}

async function renderItemsSection() {
  const itemsDiv = document.querySelector(".items");
  const itemsGrid = document.querySelector(".items-grid");

  fetch("/api/cart")
    .then((response) => util.toJson(response))
    .then((items) => {
      items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.innerHTML = `
          <div class="image-wrapper">
              <img src="${util.imgUrl}/product/${item.image}"></img>
          </div>
          <div class="item-info">
              <p class="item-title">${item.title}</p>
              <p class="item-price">${item.price} EGP</p>
              <p class="item-quantity">${item.quantity} item(s)</p>
          </div>`;
        itemsGrid.appendChild(itemDiv);
      });
      itemsDiv.querySelector(".items-title").textContent = "Your items";

      subtotal = items.reduce((prev, i) => prev + i.price, 0);
      document.querySelector(".total-price-subtotal .value").textContent = util.formatPrice(subtotal) + " EGP";
      document.querySelector(".total-price-total .value").textContent = util.formatPrice(subtotal) + " EGP";
    });
}

async function renderOrderSummaryCard() {
  const orderSummaryCard = document.querySelector(".order-summary-card");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("shipping");

  const shippingCosts = {
    free: {
      duration: "5 days",
      price: "0",
    },
    standard: {
      duration: "3 days",
      price: "25",
    },
    express: {
      duration: "1 day",
      price: "50",
    },
  };

  contentDiv.innerHTML = `
    <h3 class="shipping-title">
      Shipping
      <i class="fa-solid fa-chevron-up"></i>
    </h3>
    <div class="shipping-options">
      <div class="shipping-option">
        <input type="radio" id="free" name="shipping" value="${shippingCosts.free.price}" checked>
        <label class="shipping-option-label" for="free">
          <span>Free Shipping</span>
        </label>
        <span class="shipping-option-price">${shippingCosts.free.price} EGP</span>
        <div class="shipping-option-duration">Arrives within ${shippingCosts.free.duration} days</div>
      </div>
      <div class="shipping-option"> 
        <input type="radio" id="standard" name="shipping" value="${shippingCosts.standard.price}">
        <label class="shipping-option-label" for="standard">
          <span>Standard Shipping</span>
        </label>
        <span class="shipping-option-price">${shippingCosts.standard.price} EGP</span>
        <div class="shipping-option-duration">Arrives within ${shippingCosts.standard.duration} days</div>
      </div>
      <div class="shipping-option">
        <input type="radio" id="express" name="shipping" value="${shippingCosts.express.price}">
        <label class="shipping-option-label" for="express">
          <span>Express Shipping</span>
        </label>
        <span class="shipping-option-price">${shippingCosts.express.price} EGP</span>
        <div class="shipping-option-duration">Arrives within ${shippingCosts.express.duration} days</div>
      </div>
    </div>
    <div class="total-price">
      <h3>Total price</h3>
      <div class="total-price-subtotal">
        <span>Subtotal</span>
        <span class="value"></span>
      </div>
      <div class="total-price-shipping">
        <span>Shipping</span>
        <span class="value">0 EGP</span>
      </div>
      <div class="total-price-total">
        <span class="value"></span>
      </div>
    </div>
    
  `;

  orderSummaryCard.appendChild(contentDiv);

  orderSummaryCard.querySelector(".shipping-title").addEventListener("click", () => {
    orderSummaryCard.querySelector(".shipping-title i").classList.toggle("down");
    orderSummaryCard.querySelector(".shipping-options").classList.toggle("inactive");
  });

  orderSummaryCard.querySelectorAll('input[name="shipping"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      orderSummaryCard.querySelector(".total-price-shipping .value").textContent = e.target.value + " EGP";
      orderSummaryCard.querySelector(".total-price-total .value").textContent =
        util.formatPrice(+subtotal + +e.target.value) + " EGP";
    });
  });
}
