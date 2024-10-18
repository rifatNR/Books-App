import { initBookLoader, initWishlistPage, initSearch } from "./book-loader.js";
import { loadHTML } from "./html-loader.js";

Promise.all([
    loadHTML("navbar", "/components/navbar.html"),
    loadHTML("pagination-container", "/components/pagination.html"),
])
    .then(() => {
        console.log("All sections are loaded");

        const path = window.location.pathname;

        initSearch();

        if (path == "/") {
            initBookLoader();
        } else if ("/wishlist.html") {
            initWishlistPage();
            document
                .getElementById("pagination-container")
                ?.classList.add("hide");
        }
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
