import { delay, createElement, formatLargeNumber, addClass } from "./helper.js";

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
        return data?.results;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

export const initBookLoader = async () => {
    const url = `https://gutendex.com/books/?page=1`;
    // const url = `/demo-data/demo-response.json`;

    toggleLoader("show");
    const books = await fetchBooks(url);
    toggleLoader("hide");

    if (books) {
        renderBooks(books);
    }
};
