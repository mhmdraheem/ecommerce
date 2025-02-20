import * as util from "./util.mjs";

let subtotal = 0;
let items = [];
(async function getCartItems() {
  fetch("/api/cart")
    .then((response) => util.toJson(response))
    .then((itemsArr) => {
      if (itemsArr.length > 0) {
        items = itemsArr;
        fetch("/api/profile")
          .then((response) => response.json())
          .then((userData) => {
            renderInfoSection(userData);
            renderOrderSummaryCard();
            renderItemsSection(items);
          })
          .catch((err) => {
            console.error("Failed to fetch profile data:", err);
            util.showErrorToast();
          });
      } else {
        console.log("No items in cart");

        document.querySelector(".empty-page-header").classList.remove("hidden");
      }
    });
})();

function renderInfoSection(userData) {
  const pageHeader = document.querySelector(".page-header h1");
  pageHeader.textContent = "Place your order";

  const shippingInfoHeader = document.querySelector(".shipping-info-header");
  shippingInfoHeader.classList.add("visible");

  const shippingInfoContent = document.querySelector(".shipping-info-content");
  if (userData.profile) {
    console.log(profile);

    const personalInfo = profile.personalInfo;
    const address = profile.address;
    const payment = profile.paymentMethod;

    shippingInfoContent.querySelector(
      ".line-1 p"
    ).textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
    shippingInfoContent.querySelector(".line-1 a span").textContent = "edit";
    shippingInfoContent
      .querySelector(".line-1 a i")
      .classList.add("fa-solid", "fa-chevron-right", "arrow");
    shippingInfoContent.querySelector(
      ".address"
    ).textContent = `${address.addressLine1} ${address.addressLine2} ${address.country}, ${address.city}, ${address.zipCode} | ${personalInfo.email} | ${personalInfo.phone}`;

    if (payment.type === "COD") {
      shippingInfoContent.querySelector(
        ".payment"
      ).textContent = `Payment via: cash on delivery`;
    } else {
      shippingInfoContent.querySelector(
        ".payment"
      ).textContent = `Payment via: card ending with ${payment.cardNumber.substr(
        -4
      )}`;
    }
  } else {
    shippingInfoContent.querySelector(
      ".line-1 p"
    ).textContent = `Please add your personal information.`;
    shippingInfoContent.querySelector(".line-1 a span").textContent = "add";
    shippingInfoContent
      .querySelector(".line-1 a i")
      .classList.add("fa-solid", "fa-plus");
  }
}

async function renderItemsSection(items) {
  const itemsDiv = document.querySelector(".items");
  const itemsGrid = document.querySelector(".items-grid");

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `
          <a class="image-wrapper" href="/product.html?id=${item.id}" target="_blank">
              <img src="${util.imgUrl}/product/${item.image}"></img>
          </a>
          <div class="item-info">
              <a class="item-title" href="/product.html?id=${item.id}" target="_blank">${item.title}</a>
              <p class="item-price">${item.price} EGP</p>
              <p class="item-quantity">${item.quantity} item(s)</p>
          </div>`;
    itemsGrid.appendChild(itemDiv);
  });
  itemsDiv.querySelector(".items-title").textContent = "Your items";

  subtotal = items.reduce((prev, i) => prev + i.quantity * i.price, 0);

  document.querySelector(".total-price-subtotal .value").textContent =
    util.formatPrice(subtotal) + " EGP";

  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);
  document.querySelector(
    ".total-price-subtotal .items-count"
  ).textContent = `${totalQuantity} item(s)`;

  document.querySelector(".total-price-total .value").textContent =
    util.formatPrice(subtotal) + " EGP";
}

async function renderOrderSummaryCard() {
  document.querySelector(".order-wrapper").classList.remove("hidden");

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
        <span class="subtotal-wrapper">
          <span class="value"></span>
          <span class="items-count"></span>
        </span>
      </div>
      <div class="total-price-shipping">
        <span>Shipping</span>
        <span class="value">0 EGP</span>
      </div>
      <div class="total-price-total">
        <span>Total</span>
        <span class="value"></span>
      </div>
    </div>
    <div class="checkout-button">Checkout</div>
  `;

  orderSummaryCard.appendChild(contentDiv);

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

  orderSummaryCard
    .querySelectorAll('input[name="shipping"]')
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        orderSummaryCard.querySelector(
          ".total-price-shipping .value"
        ).textContent = e.target.value + " EGP";
        orderSummaryCard.querySelector(
          ".total-price-total .value"
        ).textContent = util.formatPrice(+subtotal + +e.target.value) + " EGP";
      });
    });

  const checkoutButton = orderSummaryCard.querySelector(".checkout-button");
  checkoutButton.addEventListener("click", () => {
    fetch("/api/cart/", { method: "DELETE" }).then((response) => {
      console.log(response);

      if (response.ok) {
        Swal.fire({
          title: "Order placed",
          text: `Thank you for your order! We are excited to let you know that your purchase has been successfully processed.
          Your order number is: 83121232133899`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Continue shopping",
        }).then((result) => {
          window.open("index.html", "_self");
        });
      }
    });
  });
}
