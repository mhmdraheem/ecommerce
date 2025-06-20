import * as util from "./util.mjs";
import * as addToCart from "./add-to-cart.mjs";

(async function getCartItems() {
  fetch("/ecom/api/cart")
    .then((response) => response.json())
    .then((items) => {
      if (items.length === 0) {
        renderEmptyCart();
      } else {
        renderCartItems(items);
        renderCartSummary(items);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch cart:", err);
      util.showErrorToast();
    });
})();

function renderEmptyCart() {
  const pageHeaderDiv = document.querySelector(".page-header");

  const header = document.createElement("h3");
  header.textContent = "Your cart is empty, start shopping now!";

  const homePageLink = document.createElement("a");
  homePageLink.href = "index.html";
  homePageLink.textContent = "Browse products";

  pageHeaderDiv.appendChild(header);
  pageHeaderDiv.appendChild(homePageLink);
}

function renderCartItems(items) {
  const pageHeaderDiv = document.querySelector(".page-header");

  const header = document.createElement("h3");
  header.textContent = "Shopping Cart";

  pageHeaderDiv.appendChild(header);

  const cartItemsDiv = document.querySelector(".cart-items");
  items.forEach((item) => {
    const productImage = document.createElement("img");
    productImage.classList.add("item-image");
    productImage.src = `${util.imgUrl}/product/${item.image}`;

    const imageWrapperLink = document.createElement("a");
    imageWrapperLink.classList.add("image-wrapper");
    imageWrapperLink.href = `ecom/product.html?id=${item.id}`;
    imageWrapperLink.appendChild(productImage);

    const titleHeaderLink = document.createElement("a");
    titleHeaderLink.innerText = item.title;
    titleHeaderLink.href = `ecom/product.html?id=${item.id}`;

    const priceSpan = document.createElement("span");
    priceSpan.classList.add("price");
    priceSpan.innerText = item.price + " EGP";

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("cart-item-header");
    headerDiv.appendChild(titleHeaderLink);
    headerDiv.appendChild(priceSpan);

    let freeShippingDiv;
    if (item.freeShipping) {
      freeShippingDiv = document.createElement("div");
      freeShippingDiv.classList.add("free-shipping");
      freeShippingDiv.textContent = "Eligible for free shipping";
    }

    const stockDiv = document.createElement("div");
    stockDiv.classList.add("stock");
    if (item.stock <= 5) {
      stockDiv.innerHTML = `<span class="low-stock">Only ${item.stock} items(s) left. Order now!</span>`;
    } else {
      stockDiv.innerHTML = `<span>${item.stock} items(s) in stock</span>`;
    }

    const bottomBarDiv = addToCart.create(item, { cart: true, showQuantityIfCartItem: true, deleteItemCallback });

    const deleteSpanSpinner = document.createElement("i");
    deleteSpanSpinner.classList.add("fa-solid", "fa-spinner", "fa-spin", "delete-span-spinner");

    const deleteSpanText = document.createElement("span");
    deleteSpanText.classList.add("delete-span-text");
    deleteSpanText.textContent = "Remove";
    deleteSpanText.addEventListener("click", (e) => deleteCartItem(e, item));

    const deleteSpan = document.createElement("span");
    deleteSpan.classList.add("delete-span");
    deleteSpan.appendChild(deleteSpanText);
    deleteSpan.appendChild(deleteSpanSpinner);

    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("item-quantity");
    quantityDiv.appendChild(bottomBarDiv);
    quantityDiv.appendChild(deleteSpan);

    bottomBarDiv.querySelector(".quantity-wrapper input").addEventListener("input", () => calculatePrice());

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    infoDiv.appendChild(headerDiv);
    if (freeShippingDiv) {
      infoDiv.appendChild(freeShippingDiv);
    }
    infoDiv.appendChild(stockDiv);
    infoDiv.appendChild(quantityDiv);

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.appendChild(imageWrapperLink);
    cartItemDiv.appendChild(infoDiv);

    cartItemsDiv.appendChild(cartItemDiv);
  });
}

function calculatePrice() {
  let price = 0;
  document.querySelectorAll(".cart-item").forEach((cartItem) => {
    const amount = cartItem.querySelector(".cart-item-header .price").textContent.replace("EGP", "").trim();
    const quantity = cartItem.querySelector(`.quantity-wrapper input[type="number"]`).value;
    price += +quantity * +amount;
  });

  const priceFotmatted = util.formatPrice(price);
  document.querySelector(".cart-summary-money").innerText = priceFotmatted + " EGP";

  const itemsCount = Array.from(document.querySelectorAll(".quantity-wrapper input")).reduce(
    (a, input) => a + +input.value,
    0
  );
  document.querySelector(".cart-summary-amount").innerText = itemsCount + " item(s)";
}

function deleteCartItem(e, item) {
  const deleteSpanSpinner = e.target.closest(".cart-item").querySelector(".delete-span i");
  deleteSpanSpinner.classList.add("visible");
  util.callDeleteAPI(
    item,
    () => deleteItemCallback(e),
    (e) => {
      console.log(e);
      deleteSpanSpinner.classList.remove("visible");
      util.showErrorToast();
    }
  );
}

function deleteItemCallback(e) {
  const item = e.target.closest(".cart-item");

  const itemHeight = item.offsetHeight;
  const currentScroll = window.scrollY || document.documentElement.scrollTop;

  item.remove();

  window.scrollTo({
    top: currentScroll - itemHeight,
    behavior: "smooth",
  });

  calculatePrice();

  if (document.querySelectorAll(".cart-item").length === 0) {
    const pageHeaderDiv = document.querySelector(".page-header");
    pageHeaderDiv.innerHTML = "";
    renderEmptyCart();
    util.updateCartAlert();
    document.querySelector(".cart-wrapper").remove();
    util.scrollToTop();
  }
}

function renderCartSummary(items) {
  const cartSummaryTitle = document.createElement("span");
  cartSummaryTitle.classList.add("cart-summary-title");
  cartSummaryTitle.textContent = "Cart summary";

  const cartSummaryAmountText = document.createElement("span");
  cartSummaryAmountText.classList.add("cart-summary-amount-text");
  cartSummaryAmountText.innerText = "Subtotal: ";

  const cartSummaryAmountValue = document.createElement("span");
  cartSummaryAmountValue.classList.add("cart-summary-amount-value");

  const cartSummaryMoney = document.createElement("span");
  cartSummaryMoney.classList.add("cart-summary-money");

  const cartSummaryAmount = document.createElement("span");
  cartSummaryAmount.classList.add("cart-summary-amount");

  cartSummaryAmountValue.appendChild(cartSummaryMoney);
  cartSummaryAmountValue.appendChild(cartSummaryAmount);

  const cartSummaryAmountRow = document.createElement("div");
  cartSummaryAmountRow.classList.add("cart-summary-amount-row");
  cartSummaryAmountRow.appendChild(cartSummaryAmountText);
  cartSummaryAmountRow.appendChild(cartSummaryAmountValue);

  const checkoutButton = document.createElement("a");
  checkoutButton.classList.add("cart-summary-checkout");
  checkoutButton.href = "checkout.html";
  checkoutButton.textContent = "Buy now";

  const freeShippingIcon = document.createElement("i");
  freeShippingIcon.classList.add("free-shipping-icon", "fa-regular", "fa-circle-check");

  const freeShippingText = document.createElement("span");
  freeShippingText.classList.add("free-shipping-text");
  freeShippingText.textContent = "Some items are eligible for free shipping";

  const freeShipping = document.createElement("span");
  freeShipping.classList.add("free-shipping-eligible");
  freeShipping.appendChild(freeShippingIcon);
  freeShipping.appendChild(freeShippingText);

  const cartSummary = document.querySelector(".cart-summary-card");
  cartSummary.appendChild(cartSummaryTitle);
  cartSummary.appendChild(cartSummaryAmountRow);
  if (items.find((item) => item.freeShipping)) {
    cartSummary.appendChild(freeShipping);
  }
  cartSummary.appendChild(checkoutButton);
}
