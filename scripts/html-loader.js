export const loadHTML = (containerId, file) => {
    return fetch(file)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return response.text();
        })
        .then((data) => {
            document.getElementById(containerId).innerHTML = data;
        });
};
