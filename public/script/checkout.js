import * as util from "./util.js";
import * as addToCart from "./add-to-cart.js";

(async function getCartItems() {
  fetch("/api/profile")
    .then((response) => response.json())
    .then((profile) => {
      renderInfoSection(profile);
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
