const productsPerPage = 15;
let sortBy = "rating";
let page = 1;

// async function fetchProducts() {
//   try {
//     const response = await fetch(`/api/product?limit=${productsPerPage}&sortBy=${sortBy}&page=${page}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     const data = await response.json();
//     return {
//       products: data.products,
//       totalPages: data.totalPages,
//       currentPage: data.currentPage,
//       pagination: data.pagination,
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       products: [],
//       totalPages: 0,
//       currentPage: 1,
//       pagination: {},
//     };
//   }
// }

async function fetchProducts() {
  return fetch(`/api/product?limit=${productsPerPage}&sortBy=${sortBy}&page=${page}`);
}

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

  // Cart Icons
  const bottomProductBarDiv = document.createElement("div");
  bottomProductBarDiv.classList.add("bottom-product-bar");

  // Add to cart
  const cartAddDiv = document.createElement("div");
  cartAddDiv.classList.add("cart-add");
  cartAddDiv.addEventListener("click", async () => {
    if(cartAddDiv.classList.contains("active")) {
      return;
    }
    
    cartAddDiv.classList.add("active");
    cartAddIcon.classList.add("hidden");
    spinner.classList.remove("hidden");

    try {
      fetch(`/api/cart/${product.id}`, {
        method: 'POST'
      })
        .then(response => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Failed to add item to cart");
          }
          return response.json();
        })
        .then(cart => {
          console.log(cart);
        }).catch(err => {
          console.error(err);
        });

      cartAddDiv.classList.add("hidden");
      spinner.classList.add("hidden");
      quantityWrapper.classList.remove("hidden");
      quantityInput.value = 1;
    } catch (err) {
      spinner.classList.add("hidden");
      cartAddIcon.classList.remove("hidden");
      cartAddDiv.classList.remove("active");
    }
  });

  const spinner = document.createElement("i");
  spinner.classList.add("fa-solid", "fa-spinner", "fa-spin", "spinner-icon", "hidden");

  const cartAddIcon = document.createElement("i");
  cartAddIcon.classList.add("fa-solid", "fa-cart-shopping", "cart-icon");
  cartAddIcon.setAttribute("aria-label", "Add to cart");

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = 0;
  quantityInput.max = product.stock;
  quantityInput.value = 1;

  quantityInput.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    if (value > product.stock) {
      e.target.value = product.stock;
    }
  });

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add("decrease");
  decreaseBtn.innerHTML = "-";
  decreaseBtn.addEventListener("click", async (e) => {
    const currentValue = parseInt(quantityInput.value);
    const newQuantity = currentValue - 1;

    if (newQuantity >= 1) {
      updateProductQuantity(product.id, quantityInput, newQuantity);
    } else {
      quantityWrapper.classList.add("hidden");
      spinner.classList.remove("hidden");
      cartAddDiv.classList.remove("active");
      cartAddDiv.classList.remove("hidden");
      try {
        fetch(`/api/cart/${product.id}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              console.log(response);
              throw new Error("Failed to remove item from cart");
            }
            return response.json();
          })
          .then(cart => {
            console.log(cart);
          }).catch(err => {
            console.error(err);
          });
        cartAddIcon.classList.remove("hidden");
      } catch (err) {
        quantityWrapper.classList.remove("hidden");
        cartAddDiv.classList.add("active");
      } finally {
        spinner.classList.add("hidden");
      }
    }
  });

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("increase");
  increaseBtn.innerHTML = "+";
  increaseBtn.addEventListener("click", async (e) => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < product.stock) {
      const newQuantity = currentValue + 1;
      updateProductQuantity(product.id, quantityInput, newQuantity);
    }
  });

  const quantityWrapper = document.createElement("div");
  quantityWrapper.classList.add("quantity-wrapper", "hidden");
  quantityWrapper.appendChild(decreaseBtn);
  quantityWrapper.appendChild(quantityInput);
  quantityWrapper.appendChild(increaseBtn);

  cartAddDiv.appendChild(spinner);
  cartAddDiv.appendChild(cartAddIcon);

  bottomProductBarDiv.appendChild(cartAddDiv);
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

async function updateProductQuantity(productId, quantityInput, quantity) {
  return fetch(`/api/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity })
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to update cart");
    }
    return response.json();
  }).then(cart => {
    console.log(cart);
    quantityInput.value = quantity;
  }).catch(err => {
    console.error(err);
  });
}

async function renderDisplay() {
  const sortBySelect = document.getElementById("sort-by-select");
  sortBy = sortBySelect.value;
  createOverlay();
  fetchProducts()
  .then(response => {
    if(response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to fetch products");
    }
  }).then(data => {
    const products = data.products;
    renderProducts(products);

    const totalPages = data.totalPages;
    const currentPage = data.currentPage;
    const pagination = data.pagination;
    renderPaginationBars(totalPages, currentPage, pagination);

    removeOverlay();
  }).catch(err => {
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
        pageButton.addEventListener("click", async () => {
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
          pageButton.addEventListener("click", async () => {
            page = startPage + i;
            renderDisplay();
          });
          pagesDiv.appendChild(pageButton);
        }
      }
    }

    // Add event listeners for prev/next buttons
    prevButton.addEventListener("click", async () => {
      if (pagination.previous) {
        page = currentPage - 1;
        renderDisplay();
      }
    });

    nextButton.addEventListener("click", async () => {
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

// Add event listeners
document.getElementById("sort-by-select").addEventListener("change", renderDisplay);


document.querySelector(".scroll-to-top").addEventListener("click", scrollToTop);
