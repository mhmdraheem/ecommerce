const products = [
  {
    id: 1,
    img: "img/joystick.jpg",
    title: "Joystick 1",
    rating: 4.5,
    stock: 299,
    oldPrice: 23.9,
    currentPrice: 2,
    discount: 20,
    freeShipping: true,
  },
  {
    id: 2,
    img: "img/joystick.jpg",
    title: "Cale 6 Eu Accumsan Massa Facilisis Madden By Steve",
    rating: 3,
    stock: 4,
    currentPrice: 21.9,
    freeShipping: true,
  },
  {
    id: 3,
    img: "img/joystick.jpg",
    title: "New item",
    rating: 5,
    stock: 40,
    currentPrice: 200,
  },
];

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
  imgWrapper.href = `product.html?id=${product.id}`;
  imgWrapper.target = "_blank";

  const img = document.createElement("img");
  img.src = product.img;
  img.alt = product.title;
  imgWrapper.appendChild(img);

  if (product.discount) {
    const discountLabel = document.createElement("span");
    discountLabel.classList.add("discount-label");
    discountLabel.textContent = product.discount + "%";
    imgWrapper.appendChild(discountLabel);
  }

  // Details container
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("details");

  // Rating
  const ratingElement = generateStars(product.rating);

  // Title
  const title = document.createElement("a");
  title.classList.add("title");
  title.textContent = product.title;
  title.href = `product.html?id=${product.id}`;
  title.target = "_blank";

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
  currentPriceSpan.innerHTML = `<sup>EGP</sup>${product.currentPrice.toFixed(2)}`;
  priceDiv.appendChild(currentPriceSpan);

  if (product.oldPrice) {
    const oldPriceSpan = document.createElement("span");
    oldPriceSpan.classList.add("old");
    oldPriceSpan.innerHTML = `${product.oldPrice.toFixed(2)}`;
    priceDiv.appendChild(oldPriceSpan);
  }

  const freeShippingSpan = document.createElement("span");
  freeShippingSpan.classList.add("free-shipping");
  if (product.freeShipping) {
    freeShippingSpan.textContent = "FREE shipping";
  }

  // Cart Icons
  const cartIconsDiv = document.createElement("div");
  cartIconsDiv.classList.add("bottom-product-bar");

  // Remove from cart
  const cartRemoveDiv = document.createElement("div");
  cartRemoveDiv.classList.add("cart-remove");
  cartRemoveDiv.addEventListener("click", () => {
    cartRemoveDiv.classList.remove("active");
    removeCartItem(product.id);
    cartAddDiv.classList.remove("active");
  });

  const cartRemoveIcon = document.createElement("i");
  cartRemoveIcon.classList.add("trash-icon", "fa-solid", "fa-trash");
  cartRemoveIcon.setAttribute("aria-label", "Add to cart");

  cartRemoveDiv.appendChild(cartRemoveIcon);

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
  quantityInput.min = 1;
  quantityInput.max = product.stock;
  quantityInput.value = 1;

  quantityInput.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      e.target.value = 1;
    } else if (value > product.stock) {
      e.target.value = product.stock;
    }
  });

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add("decrease");
  decreaseBtn.innerHTML = "-";
  decreaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("increase");
  increaseBtn.innerHTML = "+";
  increaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < product.stock) {
      quantityInput.value = currentValue + 1;
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
        cartRemoveDiv.classList.add("active");
        spinner.classList.add("hidden");
        quantityWrapper.classList.remove("hidden");
        addCartItem(product.id);
      } catch (err) {
        spinner.classList.add("hidden");
        cartAddIcon.classList.remove("hidden");
      }
    }
  });

  cartAddDiv.appendChild(spinner);
  cartAddDiv.appendChild(quantityWrapper);

  cartRemoveDiv.addEventListener("click", () => {
    cartRemoveDiv.classList.remove("active");
    quantityWrapper.classList.add("hidden");
    cartAddIcon.classList.remove("hidden");
  });

  cartAddDiv.appendChild(cartAddIcon);

  cartIconsDiv.appendChild(cartAddDiv);
  cartIconsDiv.appendChild(cartRemoveDiv);

  // Append elements to details
  detailsDiv.appendChild(title);
  detailsDiv.appendChild(ratingElement);
  detailsDiv.appendChild(priceDiv);
  detailsDiv.appendChild(freeShippingSpan);
  detailsDiv.appendChild(stockSpan);
  detailsDiv.appendChild(cartIconsDiv);

  // Append everything to product div
  productDiv.appendChild(imgWrapper);
  productDiv.appendChild(detailsDiv);

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
  cart.push(item);
  document.querySelector(".cart .alert").classList.add("visible");
}

function removeCartItem(item) {
  let idx = cart.indexOf(item);
  if (idx > -1) {
    cart.splice(idx, 1);
  }

  if (cart.length === 0) {
    document.querySelector(".cart .alert").classList.remove("visible");
  }
}

function sortProducts(products, sortBy) {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "price":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
  }

  return sortedProducts;
}

function updateProductsDisplay() {
  const productsCountSelect = document.getElementById("products-count-select");
  const sortBySelect = document.getElementById("sort-by-select");
  const productsContainer = document.querySelector(".products");

  const selectedCount = parseInt(productsCountSelect.value);
  const sortBy = sortBySelect.value;

  // Clear current products
  productsContainer.innerHTML = "";

  // Sort and display selected number of products
  const sortedProducts = sortProducts(products, sortBy);
  sortedProducts.slice(0, selectedCount).forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });
}

// Add event listeners
document.getElementById("products-count-select").addEventListener("change", updateProductsDisplay);
document.getElementById("sort-by-select").addEventListener("change", updateProductsDisplay);
