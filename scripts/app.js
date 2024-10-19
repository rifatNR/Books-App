import {
    initBookLoader,
    initWishlistPage,
    initSearch,
    initSingleView,
} from "./book-loader.js";
import { addClass } from "./helper.js";
import { loadHTML } from "./html-loader.js";

Promise.all([
    loadHTML("navbar", "/components/navbar.html"),
    loadHTML("loading-container", "/components/loader.html"),
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
            addClass("#pagination-container", ["hide"]);
        } else if (path == "/view.html") {
            initSingleView();
            addClass("#searchbar-container", ["hide"]);
        }
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
