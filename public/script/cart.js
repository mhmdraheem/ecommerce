import * as util from "./util.js";
import * as addToCart from "./add-to-cart.js";

(async function getCartItems() {
  fetch("/api/cart")
    .then((response) => response.json())
    .then((items) => {
      if (items.length === 0) {
        renderEmptyCart();
      } else {
        render(items);
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

function render(items) {
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
    imageWrapperLink.href = `product.html?id=${item.id}`;
    imageWrapperLink.appendChild(productImage);
    imageWrapperLink.target = "_blank";

    const titleHeaderLink = document.createElement("a");
    titleHeaderLink.innerText = item.title;
    titleHeaderLink.href = `product.html?id=${item.id}`;
    titleHeaderLink.target = "_blank";

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

    const bottomBarDiv = addToCart.create(item, { showQuantityIfCartItem: true });

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

    bottomBarDiv.querySelector(".decrease").addEventListener("click", (e) => {
      if (bottomBarDiv.querySelector(".quantity-wrapper input").value == 1) {
        deleteCartItem(e, item);
      }
    });

    bottomBarDiv.querySelector(".quantity-wrapper input").addEventListener("input", () => {
      calculatePrice();
      calculateShipping();
      calculateTotalPrice();
    });

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

  const totalPriceDiv = createTotalPriceElement();
  cartItemsDiv.appendChild(totalPriceDiv);
}

function createTotalPriceElement() {
  const totalPrice = document.createElement("div");
  totalPrice.classList.add("total-price");

  const amountSpan = document.createElement("span");
  amountSpan.classList.add("total-price-amount");
  totalPrice.appendChild(amountSpan);

  const taxSpan = document.createElement("span");
  taxSpan.classList.add("total-price-tax");
  taxSpan.textContent = "Tax: 0 EGP";
  totalPrice.appendChild(taxSpan);

  const shippingSpan = document.createElement("span");
  shippingSpan.classList.add("total-price-shipping");
  totalPrice.appendChild(shippingSpan);

  const totalPriceTotalSpan = document.createElement("span");
  totalPriceTotalSpan.classList.add("total-price-total");
  totalPrice.appendChild(totalPriceTotalSpan);

  const totalPriceTotalSpanName = document.createElement("span");
  totalPriceTotalSpan.appendChild(totalPriceTotalSpanName);

  const totalPriceTotalSpanValue = document.createElement("span");
  totalPriceTotalSpan.appendChild(totalPriceTotalSpanValue);

  return totalPrice;
}

function calculatePrice() {
  let price = 0;
  document.querySelectorAll(".cart-item").forEach((cartItem) => {
    const amount = cartItem.querySelector(".cart-item-header .price").textContent.replace("EGP", "").trim();
    const quantity = cartItem.querySelector(`.quantity-wrapper input[type="number"]`).value;
    price += +quantity * +amount;
  });

  const priceFotmatted = price.toLocaleString("en-us", { maximumFractionDigits: 2 });
  document.querySelector(".total-price-amount").innerText = "Price: " + priceFotmatted + " EGP";
}

function calculateShipping() {
  document.querySelector(".total-price-shipping").innerText = "Shipping: 0 EGP";
}

function calculateTotalPrice() {
  const amount = document.querySelector(".total-price-amount").textContent.match("[,.0-9]+")[0].replace(",", "");
  const shipping = document.querySelector(".total-price-shipping").textContent.match("[,.0-9]+")[0].replace(",", "");
  const tax = document.querySelector(".total-price-tax").textContent.match("[,.0-9]+")[0].replace(",", "");

  const totalPriceFormatted = (+amount + +shipping + +tax).toLocaleString("en-us", { maximumFractionDigits: 2 });
  document.querySelector(".total-price-total span:first-child").innerText = "Total: ";
  document.querySelector(".total-price-total span:last-child").innerText = totalPriceFormatted + " EGP";
}

function deleteCartItem(e, item) {
  const deleteSpanSpinner = document.querySelector(".delete-span i");
  const pageHeaderDiv = document.querySelector(".page-header");
  const cartItemDiv = e.target.closest(".cart-item");

  deleteSpanSpinner.classList.add("visible");
  util.callDeleteAPI(
    item,
    () => {
      deleteSpanSpinner.classList.remove("visible");
      cartItemDiv.remove();
      if (document.querySelectorAll(".cart-item").length === 0) {
        pageHeaderDiv.innerHTML = "";
        renderEmptyCart();
        util.updateCartAlert();
      }
    },
    (e) => {
      console.log(e);
      deleteSpanSpinner.classList.remove("visible");
      util.showErrorToast();
    }
  );
}
