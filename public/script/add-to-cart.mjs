import * as util from "./util.mjs";

export function create(product, options = {}) {
  const bottomProductBarDiv = document.createElement("div");
  bottomProductBarDiv.classList.add("bottom-product-bar");

  const cartAddIcon = document.createElement("span");
  cartAddIcon.classList.add("cart-icon");
  cartAddIcon.textContent = "Add to cart";
  cartAddIcon.setAttribute("aria-label", "Add to cart");

  const addToCartDiv = document.createElement("div");
  addToCartDiv.classList.add("add-to-cart", "cart-add-wrapper", "active");
  addToCartDiv.appendChild(cartAddIcon);
  addToCartDiv.addEventListener("click", addToCartCallback(product, bottomProductBarDiv, options));

  const addToCartspinner = document.createElement("i");
  addToCartspinner.classList.add("fa-solid", "fa-spinner", "fa-spin", "add-to-cart-spinner");

  const addToCartSpinnerDiv = document.createElement("div");
  addToCartSpinnerDiv.classList.add("add-to-cart-spinner-wrapper", "cart-add-wrapper");
  addToCartSpinnerDiv.appendChild(addToCartspinner);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = 0;
  quantityInput.max = product.stock;
  quantityInput.value = 0;
  quantityInput.addEventListener("input", quantityInputCallback(product));

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add("decrease");
  decreaseBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
  decreaseBtn.addEventListener("click", decreaseQuantityCallback(product, bottomProductBarDiv, options));

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("increase");
  increaseBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
  increaseBtn.addEventListener("click", increaseQuantityCallback(product, bottomProductBarDiv));

  const quantityWrapperSpinner = document.createElement("div");
  quantityWrapperSpinner.classList.add("quantity-wrapper-spinner-wrapper");

  const quantityWrapperSpinnerIcon = document.createElement("i");
  quantityWrapperSpinnerIcon.classList.add("fa-solid", "fa-spinner", "fa-spin", "quantity-wrapper-spinner");
  quantityWrapperSpinner.appendChild(quantityWrapperSpinnerIcon);

  const quantityWrapper = document.createElement("div");
  quantityWrapper.classList.add("quantity-wrapper", "cart-add-wrapper");
  quantityWrapper.appendChild(decreaseBtn);
  quantityWrapper.appendChild(quantityInput);
  quantityWrapper.appendChild(increaseBtn);
  quantityWrapper.appendChild(quantityWrapperSpinner);

  bottomProductBarDiv.appendChild(addToCartDiv);
  bottomProductBarDiv.appendChild(addToCartSpinnerDiv);
  bottomProductBarDiv.appendChild(quantityWrapper);

  if (options.cart) {
    addToCartDiv.classList.remove("active");
    quantityWrapper.classList.add("active");
  }

  if (options.showQuantityIfCartItem) {
    getCartItem(
      product,
      (item) => {
        if (item) {
          quantityInput.value = item.quantity;

          quantityInput.dispatchEvent(new Event("input"));

          addToCartDiv.classList.remove("active");
          quantityWrapper.classList.add("active");

          if (item.quantity > 1) {
            bottomProductBarDiv.querySelector("button.decrease").innerHTML = `<i class="fa-solid fa-minus"></i>`;
          }
        }
      },
      (err) => {
        console.error(err);
        quantityInput.value = 0;
      }
    );
  }

  return bottomProductBarDiv;
}

function addToCartCallback(product, bottomProductBarDiv, options) {
  return (e) => {
    const addToCart = bottomProductBarDiv.querySelector(".add-to-cart");
    const spinner = bottomProductBarDiv.querySelector(".add-to-cart-spinner-wrapper");
    const quantityWrapper = bottomProductBarDiv.querySelector(".quantity-wrapper");
    const quantityInput = bottomProductBarDiv.querySelector(".quantity-wrapper input");

    util.activateCartElement(bottomProductBarDiv, spinner);

    getCartItem(
      product,
      (item) => {
        if (item) {
          callUpdateProductQuantityAPI(
            product,
            "increase",
            (updatedItem) => {
              if (options.disableQuantityWrapper) {
                util.activateCartElement(bottomProductBarDiv, addToCart);
                util.showAddedToCartToast();
              } else {
                util.activateCartElement(bottomProductBarDiv, quantityWrapper);

                quantityInput.value = updatedItem.quantity;
                quantityInput.dispatchEvent(new Event("input"));

                quantityWrapper.querySelector("button.decrease").innerHTML = `<i class="fa-solid fa-minus"></i>`;
              }
              util.updateCartAlert();
            },
            (err) => {
              console.error(err);
              util.activateCartElement(bottomProductBarDiv, addToCart);
              util.showErrorToast();
            }
          );
        } else {
          callAddToCartAPI(
            product,
            (newItem) => {
              if (options.disableQuantityWrapper) {
                util.activateCartElement(bottomProductBarDiv, addToCart);
                util.showAddedToCartToast();
              } else {
                util.activateCartElement(bottomProductBarDiv, quantityWrapper);

                quantityInput.value = newItem.quantity;
                quantityInput.dispatchEvent(new Event("input"));
              }

              util.updateCartAlert();
            },
            (err) => {
              console.error(err);
              util.activateCartElement(bottomProductBarDiv, addToCart);
              util.showErrorToast();
            }
          );
        }
      },
      (err) => {
        console.error(err);
        util.activateCartElement(bottomProductBarDiv, addToCart);
        util.showErrorToast();
      }
    );
  };
}

export function callAddToCartAPI(product, onSuccess, onError) {
  fetch(`ecom/api/cart/${product.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primaryImage: product.images[0],
      title: product.heading.title,
      price: product.price.currentPrice,
      stock: product.stock,
      freeShipping: product.freeShipping,
    }),
  })
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function decreaseQuantityCallback(product, bottomProductBarDiv, options) {
  return (e) => {
    const addToCart = bottomProductBarDiv.querySelector(".add-to-cart");
    const spinner = bottomProductBarDiv.querySelector(".add-to-cart-spinner-wrapper");
    const quantityWrapper = bottomProductBarDiv.querySelector(".quantity-wrapper");
    const quantityInput = bottomProductBarDiv.querySelector(".quantity-wrapper input");
    const quantityWrapperSpinner = bottomProductBarDiv.querySelector(
      ".quantity-wrapper .quantity-wrapper-spinner-wrapper"
    );
    const newQuantity = parseInt(quantityInput.value) - 1;

    if (newQuantity >= 1) {
      quantityWrapperSpinner.classList.add("active");
      callUpdateProductQuantityAPI(
        product,
        "decrease",
        (updatedItem) => {
          quantityInput.value = updatedItem.quantity;
          quantityInput.dispatchEvent(new Event("input"));

          quantityWrapperSpinner.classList.remove("active");
          util.updateCartAlert();

          if (newQuantity == 1) {
            quantityWrapper.querySelector("button.decrease").innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
          }
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
          util.showErrorToast();
        }
      );
    } else {
      quantityWrapperSpinner.classList.add("active");
      util.callDeleteAPI(
        product,
        () => {
          quantityWrapperSpinner.classList.remove("active");
          util.activateCartElement(bottomProductBarDiv, addToCart);
          util.updateCartAlert();

          if (options.deleteItemCallback) {
            options.deleteItemCallback(e);
          }
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
          // util.activateCartElement(bottomProductBarDiv, quantityWrapper);
          util.showErrorToast();
        }
      );
    }
  };
}

function increaseQuantityCallback(product, bottomProductBarDiv) {
  return (e) => {
    const quantityInput = bottomProductBarDiv.querySelector(".quantity-wrapper input");
    const quantityWrapperSpinner = bottomProductBarDiv.querySelector(
      ".quantity-wrapper .quantity-wrapper-spinner-wrapper"
    );

    quantityWrapperSpinner.classList.add("active");
    callUpdateProductQuantityAPI(
      product,
      "increase",
      (updatedItem) => {
        quantityInput.value = updatedItem.quantity;
        quantityInput.dispatchEvent(new Event("input"));

        quantityWrapperSpinner.classList.remove("active");
        util.updateCartAlert();

        bottomProductBarDiv.querySelector("button.decrease").innerHTML = `<i class="fa-solid fa-minus"></i>`;
      },
      (err) => {
        console.error(err);
        quantityWrapperSpinner.classList.remove("active");
        util.showErrorToast();
      }
    );
  };
}

function quantityInputCallback(product) {
  return (e) => {
    const value = parseInt(e.target.value);
    if (value > product.stock) {
      e.target.value = product.stock;
    }
  };
}

function callUpdateProductQuantityAPI(product, type, onSuccess, onError) {
  fetch(`ecom/api/cart/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: type }),
  })
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function getCartItem(product, onSuccess, onError) {
  fetch(`ecom/api/cart/${product.id}`)
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}
