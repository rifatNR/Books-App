import { delay, createElement } from "./helper.js";

const renderSingleBookCard = (id) => {
    const cardHTML = `
        <div class="card fade-in">
            <div class="card-image-container">
                <img src="https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg" alt="">
                <div class="wishlist-icon">
                    <i class="fa-regular fa-heart"></i>
                </div>
            </div>
            <div class="card-texts-container">
                <div class="card-toolbar">
                    <div class="book-id">
                        #${id}
                    </div>
                    <div class="download-count">
                        <span class="download-count-text">54K</span>
                        <i class="fa-solid fa-download"></i>
                    </div>
                </div>
                <div class="card-title truncate">Harry Potter and the something something</div>
                <div class="card-subtitle truncate">George R. R. Martin</div>
            </div>
        </div>
    `;

    return cardHTML;
};

const renderBooks = async () => {
    const cardContainer = document.getElementById("card-container");

    if (!cardContainer) {
        console.error("card-container not found");
        return;
    }

    for (let i = 0; i < 10; i++) {
        await delay(200);
        const cardHTML = renderSingleBookCard(i);
        const newCard = createElement(cardHTML);
        cardContainer.appendChild(newCard);
    }
};

export const fetchBooks = async () => {};

export const initBookLoader = async () => {
    // const books = await fetchBooks()

    renderBooks();
};
