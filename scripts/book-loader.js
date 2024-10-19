import {
    delay,
    createElement,
    formatLargeNumber,
    addClass,
    getQueryParam,
    debounce,
} from "./helper.js";
import { initWishlistEventListener, loadWishlistIds } from "./wishlist.js";

const toggleLoader = (state = null) => {
    const loaderEl = document.getElementById("loader");
    if (!state) {
        const isHidden = loaderEl?.classList.contains("hide");
        if (isHidden) {
            loaderEl?.classList.remove("hide");
        } else {
            loaderEl?.classList.add("hide");
        }
    } else {
        if (state == "hide") {
            loaderEl?.classList.add("hide");
        } else if (state == "show") {
            loaderEl?.classList.remove("hide");
        }
    }
};
const toggleError = (msg, state = null) => {
    const errorEl = document.getElementById("error");
    const errorMsgEl = document.getElementById("error-msg");

    errorMsgEl.innerHTML = msg ?? "Something went wrong!!";

    if (!state) {
        const isHidden = errorEl.classList.contains("hide");
        if (isHidden) {
            errorEl.classList.remove("hide");
        } else {
            errorEl.classList.add("hide");
        }
    } else {
        if (state == "hide") {
            errorEl.classList.add("hide");
        } else if (state == "show") {
            errorEl.classList.remove("hide");
        }
    }
};
const toggleSearchInput = (state) => {
    const searchbarContainer = document.getElementById("searchbar-container");
    const searchInput = document.getElementById("search-input");

    if (state == "disable") {
        searchbarContainer.classList.add("disable");
        searchInput.disabled = true;
    } else if (state == "enable") {
        searchbarContainer.classList.remove("disable");
        searchInput.disabled = false;
    }
};

const updatePagination = (currentPage, totalPage) => {
    const paginationContainer = document.querySelector(".pagination-numbers");
    const prevButton = document.querySelector(".pagination-link.prev");
    const nextButton = document.querySelector(".pagination-link.next");

    paginationContainer.innerHTML = "";

    if (currentPage > 1) {
        prevButton.style.display = "inline-flex";
        prevButton.href = `?page=${currentPage - 1}`;
    } else {
        prevButton.style.display = "none";
    }

    if (currentPage < totalPage) {
        nextButton.style.display = "inline-flex";
        nextButton.href = `?page=${currentPage + 1}`;
    } else {
        nextButton.style.display = "none";
    }

    // ! Calculate the start and end page numbers (with 2-page offset)
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPage);

    console.table({
        currentPage,
        totalPage,
        startPage,
        endPage,
    });

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement("a");
        pageLink.href = `?page=${i}`;
        pageLink.textContent = i;
        pageLink.classList.add("pagination-link");

        if (i === currentPage) {
            pageLink.classList.add("active");
        }

        paginationContainer.appendChild(pageLink);
    }
};

const renderSingleBookCard = async (
    id,
    title,
    image,
    authors,
    totalDownload
) => {
    const authorsHtml = authors?.map(
        (author) => `<div class="card-subtitle truncate">${author?.name}</div>`
    );

    const cardHTML = `
        <a href="/view.html?book_id=${id}" id="card_${id}" class="card">
            <div class="card-image-container">
                <img src="${image}" alt="">
                <div data-id="${id}" id="wishlist_${id}" class="wishlist shadow">
                    <i class="fa-regular fa-heart pointer-none"></i>
                </div>
            </div>
            <div  class="card-texts-container">
                <div class="card-toolbar">
                    <div class="book-id">
                        #${id}
                    </div>
                    <div class="download-count">
                        <span class="download-count-text">${totalDownload}</span>
                        <i class="fa-solid fa-download"></i>
                    </div>
                </div>
                <div class="card-title truncate" title="${title}">${title}</div>
                <div id="author-container">${authorsHtml?.join("")}</div>
                
            </div>
        </a>
    `;

    return cardHTML;
};

const renderBooks = async (books) => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    if (!cardContainer) {
        console.error("card-container not found");
        return;
    }

    for (let i = 0; i < books?.length; i++) {
        const book = books[i];
        const { id, title, authors, download_count } = book;
        const image = book.formats["image/jpeg"];
        const totalDownload = formatLargeNumber(download_count);

        const cardHTML = await renderSingleBookCard(
            id,
            title,
            image,
            authors,
            totalDownload
        );
        const newCard = createElement(cardHTML);
        cardContainer.appendChild(newCard);

        setTimeout(() => {
            addClass(`#card_${id}`, ["fade-in"]);
        }, 50 * i);
    }
};

export const fetchBooks = async (_url) => {
    const url = _url.replaceAll(" ", "%20");
    console.log("url: ", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return {
            books: data?.results,
            totalResults: data?.count,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            books: null,
            totalResults: 0,
        };
    }
};

const fetchBooksByIds = async (ids) => {
    const baseUrl = "https://gutendex.com/books/";
    try {
        const requests = ids.map((id) =>
            fetch(`${baseUrl}${id}`).then((response) => response.json())
        );
        const results = await Promise.all(requests);
        return results;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const initBookLoader = async () => {
    const currentPage = parseInt(getQueryParam("page") ?? 1);

    const mainUrl = `https://gutendex.com/books/?page=${currentPage}`;
    const cachedUrl = `/cache/first-page.json`;
    const url = currentPage == 1 ? cachedUrl : mainUrl;

    toggleLoader("show");
    toggleSearchInput("disable");
    const { books, totalResults } = await fetchBooks(url);
    toggleLoader("hide");
    toggleSearchInput("enable");

    toggleError(
        "404: No books found!",
        !!books && books?.length ? "hide" : "show"
    );

    if (books) {
        const totalPage = Math.ceil(totalResults / books.length);
        updatePagination(currentPage, totalPage);

        await renderBooks(books);
        loadWishlistIds();
        initWishlistEventListener();
    }
};

export const initSingleView = async () => {
    console.log("initSingleView");

    const id = getQueryParam("book_id");

    toggleLoader("show");
    const books = await fetchBooksByIds([id]);
    // const books = await fetch(`/cache/demo-single-book.json`).then((response) =>
    //     response.json()
    // );
    const book = books[0];
    toggleLoader("hide");

    toggleError("404: Book not found!", !!book.id ? "hide" : "show");

    console.log("-----", book);

    if (book.id) {
        console.log("Single Book", book);

        document.getElementById("book-id").innerHTML = "#" + book.id;
        document.getElementById("title").innerHTML = book.title;
        document.getElementById("download-count").innerHTML =
            book.download_count;
        document.getElementById("language").innerHTML = book.languages[0];
        document.getElementById("cover-image").src = book.formats["image/jpeg"];
        document.getElementById("book-iframe").src = book.formats["text/html"];
        document.getElementById("epub-download").href =
            book.formats["application/epub+zip"];
        document.getElementById("ebook-download").href =
            book.formats["application/x-mobipocket-ebook"];

        // ! Author
        const authorsHtml = book?.authors?.map(
            (author) =>
                `<div>${author?.name} <span class="author-lifespan">(${
                    author?.birth_year ?? "-"
                } - ${author?.death_year ?? "-"})</span></div>`
        );
        document.getElementById("book-authors").innerHTML =
            authorsHtml?.join("");

        // ! Subjects
        const subjectsHtml = book?.subjects?.map(
            (subject) => `<li>${subject}</li>`
        );
        document.getElementById("subjects-list").innerHTML =
            subjectsHtml?.join("");
        if (book?.subjects?.length == 0) addClass("#subjects", ["hide"]);

        // ! Awards
        const awardsHtml = book?.bookshelves?.map(
            (award) => `<li>${award}</li>`
        );
        document.getElementById("awards-list").innerHTML = awardsHtml?.join("");
        if (book?.bookshelves?.length == 0) addClass("#awards", ["hide"]);

        // ! Translators
        const translatorsHtml = book?.translators?.map(
            (translator) => `<li>${translator}</li>`
        );
        document.getElementById("translators-list").innerHTML =
            translatorsHtml?.join("");
        if (book?.translators?.length == 0) addClass("#translators", ["hide"]);
    }
};

export const initWishlistPage = async () => {
    const savedWishlistStr = localStorage.getItem("wishlist");
    const ids = savedWishlistStr ? JSON.parse(savedWishlistStr) : [];

    toggleLoader("show");
    toggleSearchInput("disable");
    const books = await fetchBooksByIds(ids);
    toggleLoader("hide");
    toggleSearchInput("enable");
    console.log(books);

    toggleError(
        "404: No books found!",
        !!books && books?.length ? "hide" : "show"
    );

    if (books) {
        await renderBooks(books);
        loadWishlistIds();
        initWishlistEventListener();
    }
};

const handleSearch = async (event) => {
    const query = event.target.value;
    console.log("Searching for:", query);

    if (!query || query == "") {
        initBookLoader();
        return;
    }

    // const currentPage = parseInt(getQueryParam("page") ?? 1);
    const url = `https://gutendex.com/books/?search=${query}`;

    toggleLoader("show");
    const { books, totalResults } = await fetchBooks(url);
    toggleLoader("hide");

    toggleError(
        "404: No books found!",
        !!books && books?.length ? "hide" : "show"
    );

    if (books) {
        const totalPage = Math.ceil(totalResults / books.length);
        // updatePagination(currentPage, totalPage);

        await renderBooks(books);
        loadWishlistIds();
        initWishlistEventListener();
    }
};
export const initSearch = async () => {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", debounce(handleSearch, 1000));
};
