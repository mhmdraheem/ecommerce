let products = [];

async function fetchProducts(numOfProducts = 5, sortBy = "rating") {
  try {
    const response = await fetch(`/products?numOfProducts=${numOfProducts}&sortBy=${sortBy}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }
}

// Initialize products on page load
fetchProducts();

const profilePic = document.querySelector(".profile");
const overlay = document.querySelector(".overlay");
profilePic.addEventListener("mouseover", function () {
  overlay.style.display = "block";
});

profilePic.addEventListener("mouseout", function () {
  overlay.style.display = "none";
});

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
  img.src = product.images[0];
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
    e.stopPropagation();
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      quantityInput.value = currentValue - 1;
      let count = decreaseCartItem(product.id);

      if (count <= 0) {
        quantityWrapper.classList.add("hidden");
        spinner.classList.remove("hidden");
        cartAddDiv.classList.remove("active");
        try {
          // Simulating backend call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          cartAddIcon.classList.remove("hidden");
        } catch (err) {
          quantityWrapper.classList.remove("hidden");
          cartAddDiv.classList.add("active");
        } finally {
          spinner.classList.add("hidden");
        }
      }
    }
  });

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("increase");
  increaseBtn.innerHTML = "+";
  increaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < product.stock) {
      quantityInput.value = currentValue + 1;
      addCartItem(product.id);
    }
  });

  const quantityWrapper = document.createElement("div");
  quantityWrapper.classList.add("quantity-wrapper", "hidden");
  quantityWrapper.appendChild(decreaseBtn);
  quantityWrapper.appendChild(quantityInput);
  quantityWrapper.appendChild(increaseBtn);

  cartAddDiv.addEventListener("click", async () => {
    if (!cartAddDiv.classList.contains("active")) {
      cartAddIcon.classList.add("hidden");
      spinner.classList.remove("hidden");

      try {
        // Simulating backend call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        cartAddDiv.classList.add("active");
        spinner.classList.add("hidden");
        quantityWrapper.classList.remove("hidden");
        quantityInput.value = 1;
        addCartItem(product.id);
      } catch (err) {
        spinner.classList.add("hidden");
        cartAddIcon.classList.remove("hidden");
      }
    }
  });

  cartAddDiv.appendChild(spinner);
  cartAddDiv.appendChild(quantityWrapper);

  cartAddDiv.appendChild(cartAddIcon);

  bottomProductBarDiv.appendChild(cartAddDiv);

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

function renderProducts() {
  const productsContainer = document.querySelector(".products");
  products.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });
  updateProductsDisplay();
}

renderProducts();

const cart = [];
function addCartItem(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: item,
      quantity: 1,
    });
  }
  document.querySelector(".cart .alert").classList.add("visible");
}

function decreaseCartItem(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item);
  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity <= 0) {
      const idx = cart.findIndex((cartItem) => cartItem.id === item);
      cart.splice(idx, 1);

      if (cart.length === 0) {
        document.querySelector(".cart .alert").classList.remove("visible");
      }

      return 0;
    } else {
      return existingItem.quantity;
    }
  } else {
    return 0;
  }
}

function removeCartItem(item) {
  const idx = cart.indexOf(item);
  cart.splice(idx, 1);

  if (cart.length === 0) {
    document.querySelector(".cart .alert").classList.remove("visible");
  }
}

async function updateProductsDisplay() {
  const productsCountSelect = document.getElementById("products-count-select");
  const sortBySelect = document.getElementById("sort-by-select");
  const productsContainer = document.querySelector(".products");

  const selectedCount = parseInt(productsCountSelect.value);
  const sortBy = sortBySelect.value;
  await fetchProducts(selectedCount, sortBy);

  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });
}

// Add event listeners
document.getElementById("products-count-select").addEventListener("change", updateProductsDisplay);
document.getElementById("sort-by-select").addEventListener("change", updateProductsDisplay);
