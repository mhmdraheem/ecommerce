const products = [
  {
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
    img: "img/joystick.jpg",
    title: "Cale 6 Eu Accumsan Massa Facilisis Madden By Steve",
    rating: 3,
    stock: 4,
    currentPrice: 21.9,
    freeShipping: true,
  },
  {
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
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("product-img-wrapper");

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
  const title = document.createElement("h3");
  title.classList.add("title");
  title.textContent = product.title;

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

  // Cart Icon
  const shortcutsDiv = document.createElement("div");
  shortcutsDiv.classList.add("shortcuts-icons");

  const cartIcon = document.createElement("i");
  cartIcon.classList.add("shortcut-icon", "fa-solid", "fa-cart-shopping");
  cartIcon.setAttribute("aria-label", "Add to cart");

  shortcutsDiv.appendChild(cartIcon);

  // Append elements to details
  detailsDiv.appendChild(title);
  detailsDiv.appendChild(ratingElement);
  detailsDiv.appendChild(priceDiv);
  detailsDiv.appendChild(freeShippingSpan);
  detailsDiv.appendChild(stockSpan);
  detailsDiv.appendChild(shortcutsDiv);

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
