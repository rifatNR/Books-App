export const saveToWishlist = (id) => {
    const savedWishlistStr = localStorage.getItem("wishlist");
    const savedWishlist = savedWishlistStr ? JSON.parse(savedWishlistStr) : [];

    const updatedWishlist = [...savedWishlist, id];
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
};
export const removeFromWishlist = (id) => {
    const savedWishlistStr = localStorage.getItem("wishlist");
    const savedWishlist = savedWishlistStr ? JSON.parse(savedWishlistStr) : [];

    const updatedWishlist = savedWishlist.filter((savedId) => savedId != id);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
};

export const updateWishlistButton = (id, isActive) => {
    const button = document.getElementById(`wishlist_${id}`);
    if (isActive) {
        button?.classList.add("active");
    } else {
        button?.classList.remove("active");
    }
};

export const initWishlistEventListener = () => {
    const wishlistButtons = document.querySelectorAll(".wishlist");

    wishlistButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const id = event.target.getAttribute("data-id");
            console.log(`Wishlist ID: ${id}`);
            if (!id) return;

            if (button.classList.contains("active")) {
                removeFromWishlist(id);
                updateWishlistButton(id, false);
            } else {
                saveToWishlist(id);
                updateWishlistButton(id, true);
            }
        });
    });
};

export const loadWishlistIds = () => {
    const savedWishlistStr = localStorage.getItem("wishlist");
    const savedWishlist = savedWishlistStr ? JSON.parse(savedWishlistStr) : [];

    savedWishlist.forEach((id) => {
        updateWishlistButton(id, true);
    });
};
