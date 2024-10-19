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

export const showToastr = (msg) => {
    const toastr = document.getElementById("toastr");
    if (!toastr) return;
    toastr.innerHTML = msg;
    toastr.classList.add("show");
    setTimeout(() => {
        toastr.classList.remove("show");
    }, 3000);
};
export const toggleLoader = (state = null) => {
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
export const toggleError = (msg, state = null) => {
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

export const removeClass = (identifier, classes) => {
    const element = document.querySelector(identifier);

    if (!element) {
        console.error(`removeClass => ${identifier} not found!`);
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        const cssClass = classes[i];
        element.classList.remove(cssClass);
    }
};

export const setInnerHtml = (identifier, content) => {
    const element = document.querySelector(identifier);

    if (!element) {
        console.error(`setInnerText => ${identifier} not found!`);
        return;
    }

    element.innerHTML = content;
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
