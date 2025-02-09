import { fetchProducts } from "./products.js";
import * as util from "./util.js";

document.querySelector(".search-query").textContent = util.query;

fetchProducts({onNoProducts: () => {
  document.querySelector(".no-results-section").classList.remove("hidden");
}});
