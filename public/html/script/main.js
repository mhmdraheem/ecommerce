const productsPerPage = 15;
let sortBy = "rating";
let page = 1;

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

  // Image Wrapper
  const imgWrapper = document.createElement("a");
  imgWrapper.classList.add("product-img-wrapper");

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = imgUrl + "/product/" + product.images[0];
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
  getCartItem(product, (item) => {
    if (item) {
      quantityInput.value = item.quantity;
    }
  });

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

function getCartItem(product, onSuccess) {
  fetch(`/api/cart/${product.id}`)
    .then((response) => toJson(response))
    .then(onSuccess)
    .catch((e) => console.error(e));
}

function addToCartCallback(product, productDiv) {
  return (e) => {
    const addToCart = productDiv.querySelector(".add-to-cart");
    const spinner = productDiv.querySelector(".add-to-cart-spinner-wrapper");
    const quantityWrapper = productDiv.querySelector(".quantity-wrapper");
    const quantityInput = productDiv.querySelector(".quantity-wrapper input");

    activateCartElement(productDiv, spinner);

    getCartItem(product, (item) => {
      if (item) {
        callUpdateProductQuantityAPI(
          product,
          item.quantity + 1,
          (updatedItem) => {
            activateCartElement(productDiv, quantityWrapper);
            quantityInput.value = updatedItem.quantity;
            updateCartAlert();
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
        callAddToCartAPI(
          product,
          (newItem) => {
            activateCartElement(productDiv, quantityWrapper);
            quantityInput.value = newItem.quantity;
            updateCartAlert();
          },
          (err) => {
            console.error(err);
            activateCartElement(productDiv, addToCart);
          }
        );
      }
    });
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
    .then((response) => toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function activateCartElement(productDiv, element) {
  productDiv.querySelectorAll(".cart-add-wrapper").forEach((wrapper) => {
    wrapper.classList.remove("active");
  });
  element.classList.add("active");
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
          updateCartAlert();
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
        }
      );
    } else {
      activateCartElement(productDiv, spinner);
      callDeleteAPI(
        product,
        () => {
          activateCartElement(productDiv, addToCart);
          updateCartAlert();
        },
        (err) => {
          console.error(err);
          activateCartElement(productDiv, quantityWrapper);
        }
      );
    }
  };
}

function callDeleteAPI(product, onSuccess, onError) {
  fetch(`/api/cart/${product.id}`, {
    method: "DELETE",
  })
    .then((response) => toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function toJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("API error occured");
  }
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
          updateCartAlert();
        },
        (err) => {
          console.error(err);
          quantityWrapperSpinner.classList.remove("active");
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
    .then((response) => toJson(response))
    .then(onSuccess)
    .catch(onError);
}

function renderDisplay() {
  const sortBySelect = document.getElementById("sort-by-select");
  sortBy = sortBySelect.value;
  createOverlay();
  fetch(`/api/product?limit=${productsPerPage}&sortBy=${sortBy}&page=${page}`)
    .then((response) => toJson(response))
    .then((data) => {
      const products = data.products;
      renderProducts(products);

      const totalPages = data.totalPages;
      const currentPage = data.currentPage;
      const pagination = data.pagination;
      renderPaginationBars(totalPages, currentPage, pagination);

      removeOverlay();
    })
    .catch((err) => {
      console.error(err);
    });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("page-overlay");
  overlay.style.top = document.querySelector("nav").offsetHeight + "px";

  const spinner = document.createElement("i");
  spinner.classList.add("fa-solid", "fa-spinner", "fa-spin", "page-overlay-spinner");

  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
}

function removeOverlay() {
  document.querySelector(".page-overlay").remove();
}

renderDisplay();

function renderProducts(products) {
  const productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });

  scrollToTop();
}

function renderPaginationBars(totalPages, currentPage, pagination) {
  const existingPagination = document.querySelectorAll(".pagination");

  for (let i = 0; i < 2; i++) {
    const paginationDiv = existingPagination[i];
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
          renderDisplay();
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
            renderDisplay();
          });
          pagesDiv.appendChild(pageButton);
        }
      }
    }

    // Add event listeners for prev/next buttons
    prevButton.addEventListener("click", () => {
      if (pagination.previous) {
        page = currentPage - 1;
        renderDisplay();
      }
    });

    nextButton.addEventListener("click", () => {
      if (pagination.next) {
        page = currentPage + 1;
        renderDisplay();
      }
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pagesDiv);
    paginationDiv.appendChild(nextButton);
  }
}

document.getElementById("sort-by-select").addEventListener("change", renderDisplay);
document.querySelector(".scroll-to-top").addEventListener("click", scrollToTop);
