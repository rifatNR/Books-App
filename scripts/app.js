import { loadHTML } from "./html-loader.js";

Promise.all([loadHTML("navbar", "./layouts/navbar.html")])
    .then(() => {
        console.log("All sections are loaded");
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
