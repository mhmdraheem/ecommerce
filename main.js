const products = [
  {
    id: 1,
    img: "img/joystick.jpg",
    title: "Cale 6 Eu Accumsan Massa Facilisis Madden By Steve",
    rating: 4.5,
    stock: 299,
    oldPrice: 23.9,
    currentPrice: 21.9,
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
    title: "Cale 6 Eu Accumsan Massa Facilisis Madden By Steve",
    rating: 5,
    stock: 40,
    currentPrice: 21.9,
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
  cartIconsDiv.classList.add("cart-icons");

  // Remove from cart
  const removeFromCartDiv = document.createElement("div");
  removeFromCartDiv.classList.add("remove-from-cart");
  removeFromCartDiv.addEventListener("click", () => {
    removeFromCartDiv.classList.remove("active");
    removeCartItem(product.id);
    addToCartDiv.classList.remove("active");
  });

  const removeFromCartcartIcon = document.createElement("i");
  removeFromCartcartIcon.classList.add("cart-icon", "fa-solid", "fa-trash");
  removeFromCartcartIcon.setAttribute("aria-label", "Add to cart");

  removeFromCartDiv.appendChild(removeFromCartcartIcon);

  // Add from cart
  const addToCartDiv = document.createElement("div");
  addToCartDiv.classList.add("add-to-cart");
  addToCartDiv.addEventListener("click", () => {
    addToCartDiv.classList.add("active");
    addCartItem(product.id);
    removeFromCartDiv.classList.add("active");
  });

  const addToCartcartIcon = document.createElement("i");
  addToCartcartIcon.classList.add("cart-icon", "fa-solid", "fa-cart-shopping");
  addToCartcartIcon.setAttribute("aria-label", "Add to cart");

  addToCartDiv.appendChild(addToCartcartIcon);

  cartIconsDiv.appendChild(addToCartDiv);
  cartIconsDiv.appendChild(removeFromCartDiv);

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
