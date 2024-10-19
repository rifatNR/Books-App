import {
    initBookLoader,
    initWishlistPage,
    initSearch,
    initSingleView,
} from "./book-loader.js";
import { addClass } from "./helper.js";
import { loadHTML } from "./html-loader.js";

const path = window.location.pathname;

let htmlToLoad = [
    loadHTML("navbar", "/components/navbar.html"),
    loadHTML("loading-container", "/components/loader.html"),
    loadHTML("error-container", "/components/error.html"),
];
if (path == "/") {
    htmlToLoad = [
        ...htmlToLoad,
        loadHTML("pagination-container", "/components/pagination.html"),
    ];
} else if (path == "/wishlist.html") {
    // Do nothing
} else if (path == "/view.html") {
    htmlToLoad = [
        ...htmlToLoad,
        loadHTML("view-container", "/components/view-content.html"),
    ];
}

Promise.all(htmlToLoad)
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
