import * as util from "./util.js";

const imgUrl = util.imgUrl;

(function navEvents() {
  if (util.query) {
    document.querySelector(".search-form input").value = util.query;
  }

  util.updateAvatar(document.querySelector("nav .user-avatar"));

  document.querySelector(".search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search");
    window.location.href = `catalog.html?name=${searchInput.value}`;
  });

  util.updateCartAlert();
})();

(function scrollToTopEvent() {
  document.querySelector(".scroll-to-top").addEventListener("click", util.scrollToTop);
})();
