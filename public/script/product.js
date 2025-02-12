import * as util from "./util.js";
import * as addToCart from "./addToCart.js";

const productId = util.queryParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const productRes = await fetch(`/api/product/${productId}`);
    const product = await productRes.json();

    createMainSection(product);
    createFeaturesSection(product);
    createReviewsSection(product);
    createRecentProductsSection(product);
  } catch (e) {
    console.error(e);
    util.showErrorToast();
  }
});

function createMainSection(product) {
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

function createFeaturesSection(product) {
  const featuresSection = document.getElementById("features");

  const featuresTitle = document.createElement("h2");
  featuresTitle.innerText = "Product Details";
  featuresSection.appendChild(featuresTitle);

  const scrollWrapper = document.createElement("div");
  scrollWrapper.classList.add("table-container");

  const table = document.createElement("table");
  table.classList.add("features-table");
  const tbody = document.createElement("tbody");

  product.features.forEach((feature) => {
    const row = document.createElement("tr");

    const featureName = document.createElement("td");
    featureName.classList.add("feature-name");
    featureName.innerText = feature.title.replace(/_/g, " ");
    row.appendChild(featureName);

    const featureValue = document.createElement("td");
    featureValue.classList.add("feature-value");
    featureValue.innerText = feature.description;
    row.appendChild(featureValue);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  scrollWrapper.appendChild(table);
  featuresSection.appendChild(scrollWrapper);
}

function createReviewsSection(product) {
  const reviewsContainer = document.getElementById("reviews");

  const reviewsTitle = document.createElement("h2");
  reviewsTitle.classList.add("reviews-title");
  reviewsTitle.innerText = "Reviews";
  reviewsContainer.appendChild(reviewsTitle);

  product.reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    const avatar = review.avatar || "avatar.png";
    const avatarImg = document.createElement("img");
    avatarImg.classList.add("review-avatar");
    avatarImg.src = `${util.imgUrl}/${avatar}`;
    avatarImg.alt = `${review.reviewer}'s avatar`;

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("review-info");

    const reviewHeader = document.createElement("div");
    reviewHeader.classList.add("review-header");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("reviewer-name");
    nameSpan.innerText = review.reviewer;

    reviewHeader.appendChild(nameSpan);

    if (review.verified) {
      const verifiedIcon = document.createElement("i");
      verifiedIcon.classList.add("fa-solid", "fa-check-circle", "verified-badge");

      const verifiedSpan = document.createElement("span");
      verifiedSpan.classList.add("verified-badge-text");
      verifiedSpan.innerText = "verified";

      reviewHeader.appendChild(verifiedIcon);
      reviewHeader.appendChild(verifiedSpan);
    }

    const ratingDiv = util.generateStars(review.rating);

    const commentP = document.createElement("p");
    commentP.classList.add("review-text");
    commentP.innerText = review.comment;

    const dateSpan = document.createElement("span");
    dateSpan.classList.add("review-date");
    dateSpan.innerText = new Date(review.date).toDateString();

    infoDiv.appendChild(reviewHeader);
    infoDiv.appendChild(ratingDiv);
    infoDiv.appendChild(commentP);
    infoDiv.appendChild(dateSpan);

    reviewDiv.appendChild(avatarImg);
    reviewDiv.appendChild(infoDiv);

    reviewsContainer.appendChild(reviewDiv);
  });
}

async function createRecentProductsSection() {
  try {
    const recentRes = await fetch(`/api/product/${productId}/recent-products`);
    const recentProducts = await recentRes.json();

    if (recentProducts.length === 0) return;

    const recentContainer = document.getElementById("recent-products");

    const recentProductsTitle = document.createElement("h2");
    recentProductsTitle.innerText = "Recently Viewed Products";
    recentContainer.appendChild(recentProductsTitle);

    const recentProductsWrapper = document.createElement("div");
    recentProductsWrapper.classList.add("recent-products-wrapper");

    recentProducts.forEach((prod) => {
      const recentProductLink = document.createElement("a");
      recentProductLink.classList.add("recent-product-link");
      recentProductLink.href = `/product.html?id=${prod.id}`;
      recentProductLink.innerHTML = `<img src="${util.imgUrl}/product/${prod.images[0]}">`;

      const productTitle = document.createElement("span");
      productTitle.classList.add("product-title");
      productTitle.innerText = prod.heading.title;

      const productPrice = document.createElement("span");
      productPrice.classList.add("product-price");
      productPrice.innerText = `${prod.price.currentPrice} EGP`;

      recentProductLink.appendChild(productTitle);
      recentProductLink.appendChild(productPrice);
      recentProductsWrapper.appendChild(recentProductLink);
    });

    recentContainer.appendChild(recentProductsWrapper);
  } catch (e) {
    console.error(e);
    util.showErrorToast();
  }
}
