import {
    delay,
    createElement,
    formatLargeNumber,
    addClass,
    getQueryParam,
} from "./helper.js";

const toggleLoader = (state = null) => {
    const loaderEl = document.getElementById("loader");
    if (!state) {
        const isHidden = loaderEl.classList.contains("hide");
        if (isHidden) {
            loaderEl.classList.remove("hide");
        } else {
            loaderEl.classList.add("hide");
        }
    } else {
        if (state == "hide") {
            loaderEl.classList.add("hide");
        } else if (state == "show") {
            loaderEl.classList.remove("hide");
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

const renderSingleBookCard = (id, title, image, authors, totalDownload) => {
    const authorsHtml = authors?.map(
        (author) => `<div class="card-subtitle truncate">${author?.name}</div>`
    );

    const cardHTML = `
        <div id="card_${id}" class="card">
            <div class="card-image-container">
                <img src="${image}" alt="">
                <div class="wishlist-icon shadow">
                    <i class="fa-regular fa-heart"></i>
                </div>
            </div>
            <div class="card-texts-container">
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
        </div>
    `;

    return cardHTML;
};

const renderBooks = async (books) => {
    const cardContainer = document.getElementById("card-container");

    if (!cardContainer) {
        console.error("card-container not found");
        return;
    }

    for (let i = 0; i < books?.length; i++) {
        const book = books[i];
        const { id, title, authors, download_count } = book;
        const image = book.formats["image/jpeg"];
        const totalDownload = formatLargeNumber(download_count);

        const cardHTML = renderSingleBookCard(
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

export const fetchBooks = async (url) => {
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

export const initBookLoader = async () => {
    const currentPage = parseInt(getQueryParam("page") ?? 1);
    const url = `https://gutendex.com/books/?page=${currentPage}`;
    // const url = `/demo-data/demo-response.json`;

    toggleLoader("show");
    const { books, totalResults } = await fetchBooks(url);
    toggleLoader("hide");

    const totalPage = Math.ceil(totalResults / books.length);
    updatePagination(currentPage, totalPage);

    toggleError("404: No books found!", !!books ? "hide" : "show");

    if (books) {
        renderBooks(books);
    }
};
