import * as util from "./util.js";
import * as addToCart from "./addToCart.js";
const productId = util.queryParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    util.createFullPageOverlay(true);

    const productRes = await fetch(`/api/product/${productId}`);
    const product = await productRes.json();

    createMainSection(product);
    createFeaturesSection(product);
    createReviewsSection(product);
    createRelatedProductsSection(product);
  } catch (e) {
    console.error(e);
    util.showErrorToast();
  } finally {
    util.removeFullPageOverlay();
  }
});

function createMainSection(product) {
  document.querySelector(".product").setAttribute("data-id", productId);

  const productImageWrapper = document.querySelector(".image-wrapper");

  const productImage = document.createElement("img");
  productImage.id = "product-image";
  productImage.src = `${util.imgUrl}/product/${product.images[0]}`;

  productImageWrapper.appendChild(productImage);

  createAltImages(product.images);
  initSwiper(product.images);

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

  document.querySelector(".product-price .current .value").innerText = "EGP" + product.price.currentPrice;

  if (product.price.discount) {
    document.querySelector(".product-price .old .value").innerText = "EGP" + product.price.oldPrice;
    document.querySelector(".product-price .old").classList.remove("hidden");
  }

  if (product.shipping.free) {
    const freeShipping = document.createElement("div");
    freeShipping.classList.add("benifit", "free-shipping");
    freeShipping.innerHTML = `<i class="fa-solid fa-truck-fast"></i>
    <span>Free Shipping</span>`;
    document.querySelector(".benifits").appendChild(freeShipping);
  }
  // if (product.returns) document.querySelector(".benifit.returns").classList.remove("hidden");
  // if (product.warranty) document.querySelector(".benifit.warranty").classList.remove("hidden");

  document.querySelector(".product-description").innerText = product.description.short;
}

function createOrderDetails(product) {
  const orderDetails = document.querySelector(".order-details");

  const soldBy = document.createElement("div");
  soldBy.classList.add("sold-by");
  soldBy.innerText = `Sold by: ${product.soldBy}`;
  orderDetails.appendChild(soldBy);

  const returns = document.createElement("div");
  returns.classList.add("returns");
  returns.innerText = `Returns: ${product.returns}`;
  orderDetails.appendChild(returns);

  const warranty = document.createElement("div");
  warranty.classList.add("warranty");
  warranty.innerText = `${product.warranty}`;
  orderDetails.appendChild(warranty);

  const shipping = document.createElement("div");
  shipping.classList.add("shipping");
  shipping.innerText = `${product.shipping}`;
  orderDetails.appendChild(shipping);

  const addToCartDiv = addToCart.create(product);
  orderDetails.appendChild(addToCartDiv);
}

function createAltImages(imagesArr) {
  const altImages = document.querySelector(".alt-images");
  imagesArr
    .filter((img) => !img.includes("cover"))
    .forEach((img, index) => {
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

function initSwiper(imagesArr) {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  imagesArr
    .filter((img) => !img.includes("cover"))
    .forEach((img) => {
      const swiperSlide = document.createElement("img");
      swiperSlide.classList.add("swiper-slide");
      swiperSlide.src = `${util.imgUrl}/product/${img}`;
      swiperWrapper.appendChild(swiperSlide);
    });

  const swiper = new Swiper(".swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      enabled: false,
    },
  });
}

function createFeaturesSection(product) {
  const featuresSection = document.getElementById("features");

  const featuresTitle = document.createElement("h2");
  featuresTitle.innerText = "Product Details";
  featuresSection.appendChild(featuresTitle);

  const featuresSummary = document.createElement("p");
  featuresSummary.classList.add("features-summary");
  featuresSummary.innerText = product.description.long;
  featuresSection.appendChild(featuresSummary);

  const coverImageWrapper = document.createElement("div");
  coverImageWrapper.classList.add("cover-image-wrapper");

  product.images
    .filter((img) => img.includes("cover"))
    .forEach((img) => {
      const coverImage = document.createElement("img");
      coverImage.classList.add("cover-image");
      coverImage.src = `${util.imgUrl}/product/${img}`;
      coverImageWrapper.appendChild(coverImage);
    });
  featuresSection.appendChild(coverImageWrapper);

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

async function createRelatedProductsSection() {
  try {
    const relatedRes = await fetch(`/api/product/${productId}/related-products`);
    const relatedProducts = await relatedRes.json();

    if (relatedProducts.length === 0) return;

    const relatedContainer = document.getElementById("related-products");

    const relatedProductsTitle = document.createElement("h2");
    relatedProductsTitle.innerText = "Related Products";
    relatedContainer.appendChild(relatedProductsTitle);

    const relatedProductsWrapper = document.createElement("div");
    relatedProductsWrapper.classList.add("related-products-wrapper");

    relatedProducts.forEach((prod) => {
      const relatedProductLink = document.createElement("a");
      relatedProductLink.classList.add("related-product-link");
      relatedProductLink.href = `/product.html?id=${prod.id}`;
      relatedProductLink.innerHTML = `<img src="${util.imgUrl}/product/${prod.images[0]}">`;

      const productTitle = document.createElement("span");
      productTitle.classList.add("product-title");
      productTitle.innerText = prod.heading.title;

      const productPrice = document.createElement("span");
      productPrice.classList.add("product-price");
      productPrice.innerText = `${prod.price.currentPrice} EGP`;

      relatedProductLink.appendChild(productTitle);
      relatedProductLink.appendChild(productPrice);
      relatedProductsWrapper.appendChild(relatedProductLink);
    });

    relatedContainer.appendChild(relatedProductsWrapper);
  } catch (e) {
    console.error(e);
    util.showErrorToast();
  }
}
