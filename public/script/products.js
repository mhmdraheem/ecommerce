import * as util from "./util.js";
import * as addToCart from "./addToCart.js";

const productsPerPage = 50;
let sortBy = "rating";
let page = 1;

document.getElementById("sort-by-select").addEventListener("change", fetchProducts);

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
  const ratingElement = util.generateStars(product.rating);

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

  const bottomProductBarDiv = addToCart.create(product);

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
