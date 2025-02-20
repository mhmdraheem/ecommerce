import { fetchProducts } from "./products.mjs";
import * as util from "./util.mjs";

document.querySelectorAll(".search-query").forEach((element) => {
  element.textContent = util.queryParams.values().next().value;
});

fetchProducts({
  onNoProducts: () => {
    document.querySelector(".no-results-section").classList.remove("hidden");
    document.querySelector(".products-section").classList.add("hidden");
  },
  onSuccess: () => {
    const headingText = document.querySelector(".search-results-heading-text");
    if (util.queryParams.has("name")) {
      headingText.textContent = `Search results for: `;
    } else if (util.queryParams.has("brand")) {
      headingText.textContent = `Brand: `;
    }

    document.querySelector(".search-query").textContent = util.queryParams.values().next().value;

    document.querySelector(".search-results-heading").classList.remove("hidden");
  },
});
