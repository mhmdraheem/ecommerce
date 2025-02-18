import * as util from "./util.js";
import * as addToCart from "./add-to-cart.js";

(async function getCartItems() {
  fetch("/api/profile")
    .then((response) => response.json())
    .then((profile) => {
      renderInfoSection(profile);
      renderItemsSection();
      renderOrderSummaryCard();
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
  const shippingInfoText = document.querySelector(".shipping-info-content");
  if (profile.personalInfo) {
    shippingInfoHeader.innerHTML = `
            <h3>Shipping information</h3>
            <a class="profile-link" href="profile.html">edit
                <i class="fa-solid fa-chevron-right arrow"></i>
            </a>
        `;

    const personalInfo = profile.personalInfo;
    const address = profile.address;
    const payment = profile.paymentMethod;

    shippingInfoText.innerHTML = `
            <h4>${personalInfo.firstName} ${personalInfo.lastName}</h4>
            <p>Address: ${address.addressLine1} ${address.addressLine2} ${address.country}, ${address.city}, ${address.zipCode} | ${personalInfo.email} | ${personalInfo.phone}</p>
        `;

    if (payment.type === "COD") {
      shippingInfoText.innerHTML += `<p class="payment-method">Payment method: cash on delivery</p>`;
    } else {
      shippingInfoText.innerHTML += `<p class="payment-method">Payment: debit card ending with: ${payment.cardNumber}</p>`;
    }
  } else {
    shippingInfoHeader.innerHTML = `
            <h3>Shipping information</h3>
            <a class="profile-link" href="profile.html" target="_blank">add
                <i class="fa-solid fa-plus"></i>
            </a>
        `;
    shippingInfoText.innerHTML = `<span>Please  visit your <a class="profile-link" href="profile.html">profile page</a> to fill out your personal information first.</span>`;
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
                </div>
            `;

        itemsGrid.appendChild(itemDiv);
      });
      itemsDiv.querySelector(".items-title").textContent = "Your items";
    });
}

async function renderOrderSummaryCard() {
  const orderSummaryCard = document.querySelector(".order-summary-card");

  const shippingDiv = document.createElement("div");
  shippingDiv.classList.add("shipping");

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

  shippingDiv.innerHTML = `
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
  `;

  orderSummaryCard.appendChild(shippingDiv);

  const totalPrice = document.createElement("div");
  totalPrice.classList.add("total-price");
  totalPrice.innerHTML = `
    <h3 class="order-card-title">Total price</h3>
    <div class="item-price">
      <span>Item price</span>
      <span>1 x ${item.price} EGP</span>
    </div>
    <div class="shipping-price">
      <span>Shipping</span>
      <span>${shippingCosts.free.price} EGP</span>
    </div>
    <div class="total-price-value">
      <span>Total</span>
      <span class="total-price-value-value">${item.price} EGP</span>
    </div>
  `;
  orderSummaryCard.appendChild(totalPrice);

  orderSummaryCard
    .querySelector(".shipping-title")
    .addEventListener("click", () => {
      orderSummaryCard
        .querySelector(".shipping-title i")
        .classList.toggle("down");

      orderSummaryCard
        .querySelector(".shipping-options")
        .classList.toggle("inactive");
    });

  //   orderSummaryCard
  //     .querySelectorAll(".shipping-option input")
  //     .forEach((input) => {
  //       input.addEventListener("change", () => {
  //         const quantity =
  //           orderSummaryCard.querySelector(
  //             ".quantity-wrapper.active input[type='number']"
  //           )?.value || 1;

  //         const shippingOption = input.getAttribute("value");
  //         document.querySelector(".shipping-price span:last-child").innerText =
  //           shippingOption + " EGP";

  //         let total = (
  //           +shippingOption +
  //           +product.price.currentPrice * quantity
  //         ).toLocaleString("en-US", {
  //           maximumFractionDigits: 2,
  //         });
  //         document.querySelector(".total-price-value-value").innerText =
  //           total + " EGP";
  //       });
  //     });
}
