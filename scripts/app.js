import {
    initBookLoader,
    initWishlistPage,
    initEventListener,
    initSingleView,
    loadSavedFilter,
} from "./book-loader.js";
import { addClass, delay, showToastr } from "./helper.js";
import { loadHTML } from "./html-loader.js";

const path = window.location.pathname;

console.log("Hey Im Running...");

let htmlToLoad = [
    loadHTML("navbar", "/components/navbar.html"),
    loadHTML("loading-container", "/components/loader.html"),
    loadHTML("error-container", "/components/error.html"),
    loadHTML("toastr-container", "/components/toastr.html"),
];
if (path == "/") {
    htmlToLoad = [
        ...htmlToLoad,
        loadHTML("pagination-container", "/components/pagination.html"),
        loadHTML("search-query-container", "/components/search-query-msg.html"),
        loadHTML("footer-container", "/components/footer.html"),
    ];
} else if (path == "/wishlist.html") {
    htmlToLoad = [
        ...htmlToLoad,
        loadHTML("footer-container", "/components/footer.html"),
    ];
} else if (path == "/view.html") {
    htmlToLoad = [
        ...htmlToLoad,
        loadHTML("view-container", "/components/view-content.html"),
    ];
}

const showSomeWelcomeMessage = async () => {
    const isWelcomeMsgRendered = localStorage.getItem("isWelcomeDone");
    if (!!isWelcomeMsgRendered) return;
    localStorage.setItem("isWelcomeDone", true);
    await delay(2000);
    showToastr("Hi. ✋😃");
    await delay(4000);
    showToastr("I'm Rifat Noor 🙋");
    await delay(5000);
    showToastr("🎉Thank you for visiting my site.🎉");
};

Promise.all(htmlToLoad)
    .then(async () => {
        console.log("All sections are loaded");

        const path = window.location.pathname;

        initEventListener();

        document.querySelector("#wishlist-link").href = "/wishlist.html";

        if (path == "/") {
            initBookLoader();
            loadSavedFilter();
            showSomeWelcomeMessage();
        } else if (path == "/wishlist.html") {
            initWishlistPage();
        } else if (path == "/view.html") {
            initSingleView();
            addClass("#searchbar-container", ["hide"]);
        }
    })
    .catch((error) => {
        console.error("Error loading sections: ", error);
    });
