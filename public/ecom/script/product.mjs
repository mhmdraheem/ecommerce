import * as util from "./util.mjs";
import * as addToCart from "./add-to-cart.mjs";

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

  document.querySelectorAll(".subheader").forEach((subheader) => subheader.classList.remove("hidden"));

  document.querySelector(".product-price .current .value").innerText = product.price.currentPrice + " EGP";

  if (product.price.discount) {
    document.querySelector(".product-price .old .value").innerText = product.price.oldPrice + " EGP";
    document.querySelector(".product-price .old").classList.remove("hidden");
  }

  if (product.price.discount) {
    const discount = document.createElement("div");
    discount.classList.add("discount");
    discount.innerHTML = `<span>${product.price.discount}% off!</span>`;
    document.querySelector(".discount-wrapper").appendChild(discount);
  }

  const quantity = document.createElement("div");
  quantity.classList.add("quantity");
  if (product.stock <= 5) {
    quantity.innerHTML = `<span class="low-stock">Only ${product.stock} items(s) left. Order now!</span>`;
  } else {
    quantity.innerHTML = `<span>${product.stock} items(s) in stock</span>`;
  }
  document.querySelector(".quantity").appendChild(quantity);

  document.querySelector(".product-description h3").innerText = "Description:";
  document.querySelector(".product-description p").innerText = product.description.short;

  const orderDetails = document.querySelector(".order-details");
  orderDetails.appendChild(createOrderDetailsCard(product));
}

function createOrderDetailsCard(product) {
  const orderDetailsCard = document.createElement("div");
  orderDetailsCard.classList.add("order-details-card");

  const price = document.createElement("div");
  price.classList.add("price");
  price.innerText = `EGP ${product.price.currentPrice}`;
  orderDetailsCard.appendChild(price);

  const soldBy = document.createElement("div");
  soldBy.classList.add("sold-by");
  soldBy.innerHTML = `Sold by: <a href="/index.html" class="sold-by-link">${product.soldBy}</a>`;
  orderDetailsCard.appendChild(soldBy);

  if (product.returns) {
    const returns = document.createElement("div");
    returns.classList.add("returns");
    returns.innerText = `Free returns within 15 days`;
    orderDetailsCard.appendChild(returns);
  }

  if (product.warranty) {
    const warranty = document.createElement("div");
    warranty.classList.add("warranty");
    warranty.innerText = `6-month warranty`;
    orderDetailsCard.appendChild(warranty);
  }

  const addToCartDiv = addToCart.create(product, {
    showQuantityIfCartItem: true,
  });

  const buyNowButton = document.createElement("div");
  buyNowButton.classList.add("buy-now-button");
  buyNowButton.innerText = "Buy Now";
  buyNowButton.addEventListener("click", () => {
    const activeQuantityWrapperDiv = orderDetailsCard.querySelector(".quantity-wrapper.active input[type='number']");
    if (activeQuantityWrapperDiv) {
      window.open("/cart.html", "_self");
    } else {
      addToCart.callAddToCartAPI(
        product,
        (newItem) => {
          window.open("/cart.html", "_self");
        },
        (err) => {
          console.error(err);
          util.showErrorToast();
        }
      );
    }
  });

  orderDetailsCard.appendChild(addToCartDiv);
  orderDetailsCard.appendChild(buyNowButton);

  return orderDetailsCard;
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

  new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      enabled: false,
    },
  });
}

async function createFeaturesSection(product) {
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

async function createReviewsSection(product) {
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
