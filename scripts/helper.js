export const createElement = (htmlString) => {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};

export const delay = (millisecond) => {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecond);
    });
};

export const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + "B";
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + "K";
    } else {
        return num.toString();
    }
};

export const addClass = (identifier, classes) => {
    const element = document.querySelector(identifier);

    if (!element) {
        console.error(`addClass => ${identifier} not found!`);
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        const cssClass = classes[i];
        element.classList.add(cssClass);
    }
};

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};
