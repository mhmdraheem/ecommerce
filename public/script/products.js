import * as util from "./util.js";

const productsPerPage = 50;
let sortBy = "rating";
let page = 1;

document.getElementById("sort-by-select").addEventListener("change", fetchProducts);

function generateStars(rating) {
  const starsContainer = document.createElement("span");
  starsContainer.classList.add("rating");

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("rating-star", "fa-solid");

    if (i <= Math.floor(rating)) {
      star.classList.add("colored--golden", "fa-star");
    } else if (i - rating < 1) {
      star.classList.add("colored--golden", "fa-star-half-stroke");
    } else {
      star.classList.add("colored--grey", "fa-star");
    }

    starsContainer.appendChild(star);
  }
  return starsContainer;
}

function createProductElement(product) {
  // Product container
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.setAttribute("data-id", product.id);

  // Image Wrapper
  const imgWrapper = document.createElement("a");
  imgWrapper.classList.add("product-img-wrapper");

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = util.imgUrl + "/product/" + product.images[0];
  img.alt = product.heading.title;
  imgWrapper.appendChild(img);

  // Details container
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("details");

  // Rating
  const ratingElement = generateStars(product.rating.stars);

  // Title
  const title = document.createElement("a");
  title.classList.add("title");
  title.textContent = product.heading.title;

  // Stock
  const stockSpan = document.createElement("span");
  stockSpan.classList.add("stock");
  if (product.stock <= 5) {
    stockSpan.textContent = `Only ${product.stock} left in stock - order soon`;
  }

  // Price
  const priceDiv = document.createElement("div");
  priceDiv.classList.add("price");

  const currentPriceSpan = document.createElement("span");
  currentPriceSpan.classList.add("current");
  currentPriceSpan.innerHTML = `<sup>EGP</sup>${product.price.currentPrice.toFixed(2)}`;
  priceDiv.appendChild(currentPriceSpan);

  if (product.price.oldPrice) {
    const oldPriceSpan = document.createElement("span");
    oldPriceSpan.classList.add("old");
    oldPriceSpan.innerHTML = `${product.price.oldPrice.toFixed(2)}`;
    priceDiv.appendChild(oldPriceSpan);
  }

  if (product.price.discount) {
    const discountLabel = document.createElement("span");
    discountLabel.classList.add("discount-label");
    discountLabel.textContent = "-" + product.price.discount + "%";
    priceDiv.appendChild(discountLabel);
  }

  const freeShippingSpan = document.createElement("span");
  freeShippingSpan.classList.add("free-shipping");
  if (product.freeShipping) {
    freeShippingSpan.textContent = "FREE shipping";
  }

  const cartAddIcon = document.createElement("i");
  cartAddIcon.classList.add("fa-solid", "fa-cart-shopping", "cart-icon");
  cartAddIcon.setAttribute("aria-label", "Add to cart");

  const addToCartDiv = document.createElement("div");
  addToCartDiv.classList.add("add-to-cart", "cart-add-wrapper", "active");
  addToCartDiv.appendChild(cartAddIcon);
  addToCartDiv.addEventListener("click", addToCartCallback(product, productDiv));

  const addToCartspinner = document.createElement("i");
  addToCartspinner.classList.add("fa-solid", "fa-spinner", "add-to-cart-spinner");

  const addToCartSpinnerDiv = document.createElement("div");
  addToCartSpinnerDiv.classList.add("add-to-cart-spinner-wrapper", "cart-add-wrapper");
  addToCartSpinnerDiv.appendChild(addToCartspinner);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = 0;
  quantityInput.max = product.stock;
  quantityInput.value = 0;
  quantityInput.addEventListener("input", quantityInputCallback(product));
  getCartItem(
    product,
    (item) => {
      if (item) {
        quantityInput.value = item.quantity;
      }
    },
    (err) => {
      console.error(err);
      quantityInput.value = 0;
    }
  );

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add("decrease");
  decreaseBtn.innerHTML = "-";
  decreaseBtn.addEventListener("click", decreaseQuantityCallback(product, productDiv));

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("increase");
  increaseBtn.innerHTML = "+";
  increaseBtn.addEventListener("click", increaseQuantityCallback(product, productDiv));

  const quantityWrapperSpinner = document.createElement("div");
  quantityWrapperSpinner.classList.add("quantity-wrapper-spinner-wrapper");

  const quantityWrapperSpinnerIcon = document.createElement("i");
  quantityWrapperSpinnerIcon.classList.add("fa-solid", "fa-spinner", "quantity-wrapper-spinner");
  quantityWrapperSpinner.appendChild(quantityWrapperSpinnerIcon);

  const quantityWrapper = document.createElement("div");
  quantityWrapper.classList.add("quantity-wrapper", "cart-add-wrapper");
  quantityWrapper.appendChild(decreaseBtn);
  quantityWrapper.appendChild(quantityInput);
  quantityWrapper.appendChild(increaseBtn);
  quantityWrapper.appendChild(quantityWrapperSpinner);

  const bottomProductBarDiv = document.createElement("div");
  bottomProductBarDiv.classList.add("bottom-product-bar");
  bottomProductBarDiv.appendChild(addToCartDiv);
  bottomProductBarDiv.appendChild(addToCartSpinnerDiv);
  bottomProductBarDiv.appendChild(quantityWrapper);

  // Append elements to details
  detailsDiv.appendChild(title);
  detailsDiv.appendChild(ratingElement);
  detailsDiv.appendChild(priceDiv);
  detailsDiv.appendChild(freeShippingSpan);
  detailsDiv.appendChild(stockSpan);

  const productInfoLink = document.createElement("a");
  productInfoLink.classList.add("product-info");
  productInfoLink.appendChild(imgWrapper);
  productInfoLink.appendChild(detailsDiv);
  productInfoLink.href = `product.html?id=${product.id}`;
  productInfoLink.target = "_blank";

  // Append everything to product div
  productDiv.appendChild(productInfoLink);
  productDiv.appendChild(bottomProductBarDiv);

  return productDiv;
}

function getCartItem(product, onSuccess, onError) {
  fetch(`/api/cart/${product.id}`)
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function addToCartCallback(product, productDiv) {
  return (e) => {
    const addToCart = productDiv.querySelector(".add-to-cart");
    const spinner = productDiv.querySelector(".add-to-cart-spinner-wrapper");
    const quantityWrapper = productDiv.querySelector(".quantity-wrapper");
    const quantityInput = productDiv.querySelector(".quantity-wrapper input");

    util.activateCartElement(productDiv, spinner);

    getCartItem(
      product,
      (item) => {
        if (item) {
          callUpdateProductQuantityAPI(
            product,
            item.quantity + 1,
            (updatedItem) => {
              util.activateCartElement(productDiv, quantityWrapper);
              quantityInput.value = updatedItem.quantity;
              util.updateCartAlert();
            },
            (err) => {
              console.error(err);
              util.showErrorToast();
            }
          );
        } else {
          callAddToCartAPI(
            product,
            (newItem) => {
              util.activateCartElement(productDiv, quantityWrapper);
              quantityInput.value = newItem.quantity;
              util.updateCartAlert();
            },
            (err) => {
              console.error(err);
              util.activateCartElement(productDiv, addToCart);
              util.showErrorToast();
            }
          );
        }
      },
      (err) => {
        console.error(err);
        util.activateCartElement(productDiv, addToCart);
        util.showErrorToast();
      }
    );
  };
}

function callAddToCartAPI(product, onSuccess, onError) {
  fetch(`/api/cart/${product.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primaryImage: product.images[0],
      title: product.heading.title,
      price: product.price.currentPrice,
    }),
  })
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function decreaseQuantityCallback(product, productDiv) {
  return (e) => {
    const addToCart = productDiv.querySelector(".add-to-cart");
    const spinner = productDiv.querySelector(".add-to-cart-spinner-wrapper");
    const quantityWrapper = productDiv.querySelector(".quantity-wrapper");
    const quantityInput = productDiv.querySelector(".quantity-wrapper input");
    const quantityWrapperSpinner = productDiv.querySelector(".quantity-wrapper .quantity-wrapper-spinner-wrapper");
    const newQuantity = parseInt(quantityInput.value) - 1;

    if (newQuantity >= 1) {
      quantityWrapperSpinner.classList.add("active");
      callUpdateProductQuantityAPI(
        product,
        newQuantity,
        (updatedItem) => {
          quantityInput.value = updatedItem.quantity;
          quantityWrapperSpinner.classList.remove("active");
          util.updateCartAlert();
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
          util.showErrorToast();
        }
      );
    } else {
      util.activateCartElement(productDiv, spinner);
      util.callDeleteAPI(
        product,
        () => {
          util.activateCartElement(productDiv, addToCart);
          util.updateCartAlert();
        },
        (err) => {
          console.error(err);
          util.activateCartElement(productDiv, quantityWrapper);
          util.showErrorToast();
        }
      );
    }
  };
}

function increaseQuantityCallback(product, productDiv) {
  return (e) => {
    const quantityInput = productDiv.querySelector(".quantity-wrapper input");
    const quantityWrapperSpinner = productDiv.querySelector(".quantity-wrapper .quantity-wrapper-spinner-wrapper");
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < product.stock) {
      quantityWrapperSpinner.classList.add("active");
      callUpdateProductQuantityAPI(
        product,
        currentValue + 1,
        (updatedItem) => {
          quantityInput.value = updatedItem.quantity;
          quantityWrapperSpinner.classList.remove("active");
          util.updateCartAlert();
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
          util.showErrorToast();
        }
      );
    }
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

function callUpdateProductQuantityAPI(product, newQuantity, onSuccess, onError) {
  fetch(`/api/cart/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: newQuantity }),
  })
    .then((response) => util.toJson(response))
    .then(onSuccess)
    .catch(onError);
}

const defaultOnSuccess = (data) => {
  document.querySelector(".display-settings").classList.remove("hidden");
  renderProducts(data.products);

  const totalPages = data.totalPages;
  const currentPage = data.currentPage;
  const pagination = data.pagination;
  renderPaginationBars(totalPages, currentPage, pagination);
}

const defaultOnNoProducts = () => {}

const defaultOnError = (err) => {
  console.error(err);
  util.showErrorToast();
}

export function fetchProducts(callbacks = {}) {
  const sortBySelect = document.getElementById("sort-by-select");
  sortBy = sortBySelect.value;

  util.createFullPageOverlay();

  fetch(`/api/product?limit=${productsPerPage}&sortBy=${sortBy}&page=${page}&query=${util.query}`)
    .then((response) => util.toJson(response))
    .then((data) => {
      const products = data.products;
      if (products.length > 0) {
        defaultOnSuccess(data);
        callbacks.onSuccess?.(data);
      } else {        
        callbacks.onNoProducts?.() || defaultOnNoProducts();
      }
    })
    .catch((err) => {      
      callbacks.onError?.(err) || defaultOnError(err);
    }).finally(() => {
      util.removeFullPageOverlay();
    });
}

function renderProducts(products) {
  const productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });

  util.scrollToTop();
}

function renderPaginationBars(totalPages, currentPage, pagination) {
  const existingPagination = document.querySelectorAll(".pagination");

  for (let i = 0; i < 2; i++) {
    const paginationDiv = existingPagination[i];
    paginationDiv.classList.remove("hidden");
    paginationDiv.innerHTML = "";

    paginationDiv.classList.add("pagination");

    const prevButton = document.createElement("button");
    prevButton.classList.add("page-btn-prev");
    prevButton.disabled = !pagination.previous;
    const prevIcon = document.createElement("i");
    prevIcon.classList.add("fa-solid", "fa-chevron-left", "next-page-icon");
    prevButton.appendChild(prevIcon);

    const pagesDiv = document.createElement("div");
    pagesDiv.classList.add("pages");

    const nextButton = document.createElement("button");
    nextButton.classList.add("page-btn-next");
    nextButton.disabled = !pagination.next;
    const nextIcon = document.createElement("i");
    nextIcon.classList.add("fa-solid", "fa-chevron-right", "next-page-icon");
    nextButton.appendChild(nextIcon);

    // Add page buttons
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("page-number");
        pageButton.textContent = i;
        if (i === currentPage) {
          pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
          page = i;
          fetchProducts();
        });
        pagesDiv.appendChild(pageButton);
      }
    } else {
      let startPage = currentPage;
      if (currentPage === totalPages) {
        startPage = currentPage - 2;
      } else if (currentPage > 1) {
        startPage = currentPage - 1;
      }

      for (let i = 0; i < 3; i++) {
        if (startPage + i <= totalPages) {
          const pageButton = document.createElement("button");
          pageButton.classList.add("page-number");
          pageButton.textContent = startPage + i;
          if (startPage + i === currentPage) {
            pageButton.classList.add("active");
          }
          pageButton.addEventListener("click", () => {
            page = startPage + i;
            fetchProducts();
          });
          pagesDiv.appendChild(pageButton);
        }
      }
    }

    // Add event listeners for prev/next buttons
    prevButton.addEventListener("click", () => {
      if (pagination.previous) {
        page = currentPage - 1;
        fetchProducts();
      }
    });

    nextButton.addEventListener("click", () => {
      if (pagination.next) {
        page = currentPage + 1;
        fetchProducts();
      }
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pagesDiv);
    paginationDiv.appendChild(nextButton);
  }
}
