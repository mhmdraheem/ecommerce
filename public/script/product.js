import * as util from "./util.js";
import * as addToCart from "./addToCart.js";

const productId = util.getQueryParam("id");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const productRes = await fetch(`/api/product/${productId}`);
    const product = await productRes.json();

    const mainSection = document.querySelector(".main-section");
    document.querySelector(".product").setAttribute("data-id", productId);

    const productImage = document.getElementById("product-image");
    productImage.src = `${util.imgUrl}/product/${product.images[0]}`;
    productImage.addEventListener("click", () => {
      console.log("zoom");
    });
    createAltImages(product.images);

    document.querySelectorAll(".product-title").forEach((title) => {
      title.innerText = product.heading.title;
    });

    document.querySelectorAll(".product-brand").forEach((brand) => {
      brand.innerText = product.heading.brand;
      brand.href = `/catalog.html?brand=${product.heading.brand}`;
    });

    document.querySelectorAll(".product-rating").forEach((rating) => {
      rating.appendChild(util.generateStars(product.rating, true));
    });

    document.querySelector(".product-price .current sup").innerText = "EGP";
    document.querySelector(".product-price .current .value").innerText = product.price.currentPrice;

    if (product.price.discount) {
      document.querySelector(".product-price .old .value").innerText = product.price.oldPrice;
      document.querySelector(".product-price .old").classList.remove("hidden");
    }

    if (product.freeShipping) document.querySelector(".benifit.free-shipping").classList.remove("hidden");
    if (product.returns) document.querySelector(".benifit.returns").classList.remove("hidden");
    if (product.warranty) document.querySelector(".benifit.warranty").classList.remove("hidden");

    document.querySelector(".product-description .short .text").innerText = product.description.short;
    document.querySelector(".product-description .short .show-more").innerText = "Show more";

    document.querySelector(".product-description .long .text").innerText = product.description.long;
    document.querySelector(".product-description .long .show-less").innerText = "Show less";

    document.querySelector(".product-description .show-more").addEventListener("click", () => {
      document.querySelector(".product-description .short").classList.add("hidden");
      document.querySelector(".product-description .long").classList.remove("hidden");
    });

    document.querySelector(".product-description .show-less").addEventListener("click", () => {
      document.querySelector(".product-description .short").classList.remove("hidden");
      document.querySelector(".product-description .long").classList.add("hidden");
    });

    const addToCartDiv = addToCart.create(product);
    document.querySelector(".product-description").after(addToCartDiv);
  } catch (e) {
    console.error(e);
    util.showErrorToast();
  }
});

function createMainSection(product) {
  const mainSection = document.querySelector(".main-section");

  const imagesDiv = document.createElement("div");
  imagesDiv.classList.add("images");

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-wrapper");

  const productImage = document.createElement("img");
  productImage.id = "product-image";
  productImage.alt = "Product Image";

  imageWrapper.appendChild(productImage);
  imagesDiv.appendChild(imageWrapper);

  const altImagesDiv = document.createElement("div");
  altImagesDiv.classList.add("alt-images");
  imagesDiv.appendChild(altImagesDiv);

  // Create the details section
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("details");

  const productTitle = document.createElement("h1");
  productTitle.id = "product-title";
  productTitle.classList.add("product-title");

  const subHeaderDiv = document.createElement("div");
  subHeaderDiv.classList.add("subheader");

  const productBrand = document.createElement("a");
  productBrand.id = "product-brand";
  productBrand.target = "_blank";

  const productRating = document.createElement("span");
  productRating.id = "product-rating";
  productRating.classList.add("product-rating");

  subHeaderDiv.appendChild(productBrand);
  subHeaderDiv.appendChild(productRating);

  const productPriceDiv = document.createElement("div");
  productPriceDiv.id = "product-price";
  productPriceDiv.classList.add("product-price");

  const currentPriceSpan = document.createElement("span");
  currentPriceSpan.classList.add("current");

  const currencySup = document.createElement("sup");
  currencySup.innerText = "EGP";

  const currentValueSpan = document.createElement("span");
  currentValueSpan.classList.add("value");

  currentPriceSpan.appendChild(currencySup);
  currentPriceSpan.appendChild(currentValueSpan);

  const oldPriceSpan = document.createElement("span");
  oldPriceSpan.classList.add("old", "hidden");

  const oldValueSpan = document.createElement("span");
  oldValueSpan.classList.add("value");

  oldPriceSpan.appendChild(oldValueSpan);

  productPriceDiv.appendChild(currentPriceSpan);
  productPriceDiv.appendChild(oldPriceSpan);

  // Benefits section
  const benefitsDiv = document.createElement("div");
  benefitsDiv.classList.add("benifits");

  const benefits = [
    { class: "free-shipping", icon: "fa-truck-fast", text: "Free Shipping" },
    { class: "returns", icon: "fa-money-bill", text: "Money back guarantee" },
    { class: "warranty", icon: "fa-shield-heart", text: "3 months warranty" },
  ];

  benefits.forEach((benefit) => {
    const benefitDiv = document.createElement("div");
    benefitDiv.classList.add("benifit", benefit.class);

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", benefit.icon);

    const span = document.createElement("span");
    span.innerText = benefit.text;

    benefitDiv.appendChild(icon);
    benefitDiv.appendChild(span);
    benefitsDiv.appendChild(benefitDiv);
  });

  // Product Description
  const productDescriptionDiv = document.createElement("div");
  productDescriptionDiv.classList.add("product-description");

  const shortDescSpan = document.createElement("span");
  shortDescSpan.classList.add("short");

  const shortTextSpan = document.createElement("span");
  shortTextSpan.classList.add("text");

  const showMoreSpan = document.createElement("span");
  showMoreSpan.classList.add("show-more");
  showMoreSpan.innerText = "Show more";

  shortDescSpan.appendChild(shortTextSpan);
  shortDescSpan.appendChild(showMoreSpan);

  const longDescSpan = document.createElement("span");
  longDescSpan.classList.add("long", "hidden");

  const longTextSpan = document.createElement("span");
  longTextSpan.classList.add("text");

  const showLessSpan = document.createElement("span");
  showLessSpan.classList.add("show-less");
  showLessSpan.innerText = "Show less";

  longDescSpan.appendChild(longTextSpan);
  longDescSpan.appendChild(showLessSpan);

  productDescriptionDiv.appendChild(shortDescSpan);
  productDescriptionDiv.appendChild(longDescSpan);

  // Append all elements to details section
  detailsDiv.appendChild(productTitle);
  detailsDiv.appendChild(subHeaderDiv);
  detailsDiv.appendChild(productPriceDiv);
  detailsDiv.appendChild(benefitsDiv);
  detailsDiv.appendChild(productDescriptionDiv);

  // Append images and details sections to main section
  mainSection.appendChild(imagesDiv);
  mainSection.appendChild(detailsDiv);

  // Append everything to the body (or any container you prefer)
  document.body.appendChild(mainSection);
}

function createAltImages(imagesArr) {
  const altImages = document.querySelector(".alt-images");
  imagesArr.forEach((img, index) => {
    const altImageWrapperDiv = document.createElement("div");
    altImageWrapperDiv.classList.add("alt-image-wrapper");
    altImageWrapperDiv.addEventListener("click", () => {
      document.getElementById("product-image").src = `${util.imgUrl}/product/${img}`;
      altImages.querySelectorAll(".alt-image-wrapper").forEach((wrapper) => {
        wrapper.classList.remove("active");
      });
      altImageWrapperDiv.classList.add("active");
    });

    const altImage = document.createElement("img");
    altImage.classList.add("alt-product-image");
    altImage.src = `${util.imgUrl}/product/${img}`;

    altImageWrapperDiv.appendChild(altImage);
    altImages.appendChild(altImageWrapperDiv);
  });

  altImages.querySelector(".alt-image-wrapper").classList.add("active");
}

// const featuresList = document.getElementById("product-features");
// product.features.forEach(feature => {
//     const li = document.createElement("li");
//     li.innerText = feature;
//     featuresList.appendChild(li);
// });

// const reviewsContainer = document.getElementById("reviews");
// product.reviews.forEach(review => {
//     const div = document.createElement("div");
//     div.innerHTML = `<strong>${review.reviewer}</strong> (${review.rating}⭐): ${review.comment}`;
//     reviewsContainer.appendChild(div);
// });

// const relatedRes = await fetch(`http://localhost:3000/api/product/${productId}/related-products`);
// const relatedProducts = await relatedRes.json();
// const relatedContainer = document.getElementById("related-container");
// relatedProducts.forEach(prod => {
//     const div = document.createElement("div");
//     div.innerHTML = `<img src="${util.imgUrl}/product/${prod.image}" width="100"><br>${prod.title} - $${prod.price}`;
//     relatedContainer.appendChild(div);
// });
