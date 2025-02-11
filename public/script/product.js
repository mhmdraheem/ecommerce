import * as util from "./util.js";
import * as addToCart from "./addToCart.js";

const productId = util.getQueryParam('id');

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const productRes = await fetch(`/api/product/${productId}`);
        const product = await productRes.json();
    
        document.querySelector(".product").setAttribute("data-id", productId);
    
        const productImage = document.getElementById("product-image");
        productImage.src = `${util.imgUrl}/product/${product.images[0]}`;
        productImage.addEventListener("click", () => {
            console.log("zoom");
        });
        createAltImages(product.images);
    
        document.getElementById("product-title").innerText = product.heading.title;
    
        document.getElementById("product-brand").innerText = product.heading.brand;
        document.getElementById("product-brand").href = `/catalog.html?brand=${product.heading.brand}`;
        
        document.getElementById("product-rating").appendChild(util.generateStars(product.rating, true));
    
        document.querySelector(".product-price .current .value").innerText = product.price.currentPrice;
        if(product.price.discount) {
            document.querySelector(".product-price .old .value").innerText = product.price.oldPrice;
            document.querySelector(".product-price .old").classList.remove("hidden");
        }
       
        document.querySelector(".product-description .short .text").innerText = product.description;
        document.querySelector(".product-description .long .text").innerText = product.description + "lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.";
        document.querySelector(".product-description .show-more").addEventListener("click", () => {
            document.querySelector(".product-description .short").classList.add("hidden");
            document.querySelector(".product-description .long").classList.remove("hidden");
        });

        document.querySelector(".product-description .show-less").addEventListener("click", () => {
            document.querySelector(".product-description .short").classList.remove("hidden");
            document.querySelector(".product-description .long").classList.add("hidden");
        });

        const addToCartDiv = addToCart.create(product);
        document.querySelector(".main-section .details").appendChild(addToCartDiv);
    
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
    } catch(e) {
        console.error(e);
        util.showErrorToast();
    }
});

function createAltImages(imagesArr) { 
    const altImages = document.querySelector(".alt-images");
    imagesArr.forEach((img, index) => {
        const altImageWrapperDiv = document.createElement("div");
        altImageWrapperDiv.classList.add("alt-image-wrapper");
        altImageWrapperDiv.addEventListener("click", () => {
            document.getElementById("product-image").src = `${util.imgUrl}/product/${img}`;
            altImages.querySelectorAll(".alt-image-wrapper").forEach(wrapper => {
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