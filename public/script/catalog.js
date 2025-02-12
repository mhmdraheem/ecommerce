import { fetchProducts } from "./products.js";
import * as util from "./util.js";

document.querySelectorAll(".search-query").forEach((element) => {
  element.textContent = util.queryParams.values().next().value;
});

fetchProducts({
  onNoProducts: () => {
    document.querySelector(".no-results-section").classList.remove("hidden");
    document.querySelector(".products-section").classList.add("hidden");
  },
  onSuccess: () => {
    document.querySelector(".search-results-heading").classList.remove("hidden");
  },
});
