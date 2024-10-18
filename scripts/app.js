import { initBookLoader } from "/scripts/book-loader.js";
import { loadHTML } from "/scripts/html-loader.js";

Promise.all([
    loadHTML("navbar", "/components/navbar.html"),
    // loadHTML("pagination-container", "/components/pagination.html"),
])
    .then(() => {
        console.log("All sections are loaded");

        initBookLoader();
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
