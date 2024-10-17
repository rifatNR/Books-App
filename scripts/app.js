import { initBookLoader } from "/scripts/book-loader.js";
import { loadHTML } from "/scripts/html-loader.js";

Promise.all([loadHTML("navbar", "/layouts/navbar.html")])
    .then(() => {
        console.log("All sections are loaded");

        initBookLoader();
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
