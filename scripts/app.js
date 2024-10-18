import {
    initBookLoader,
    initWishlistPage,
    initSearch,
    initSingleView,
} from "./book-loader.js";
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
        } else if (path == "/wishlist.html") {
            initWishlistPage();
            document
                .getElementById("pagination-container")
                ?.classList.add("hide");
        } else if (path == "/view.html") {
            initSingleView();
            document
                .getElementById("searchbar-container")
                ?.classList.add("hide");
        }
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
