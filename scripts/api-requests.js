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

export const fetchSingleBook = async (id) => {
    try {
        const response = await fetch(`https://gutendex.com/books/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const fetchBooksByIds = async (ids) => {
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
