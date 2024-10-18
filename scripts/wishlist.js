export const saveToWishlist = (id) => {
    const savedWishlistStr = localStorage.getItem("wishlist");
    const savedWishlist = savedWishlistStr ? JSON.parse(savedWishlistStr) : [];

    const updatedWishlist = [...savedWishlist, id];
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
};
