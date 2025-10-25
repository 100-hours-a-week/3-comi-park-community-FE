export const getCookie = (key) => {
    return document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${key}=`))
        ?.split('=')[1];
};

export const setCookie = (key, value, options = { path: '/' }) => {
    let stringifiedOptions = '';

    for (const key in options) {
        stringifiedOptions += typeof options[key] === 'boolean' ? `; ${key}` : `; ${key}=${options[key]}`;
    }

    document.cookie = `${key}=${value}${stringifiedOptions}`;
};

export const destroyCookie = (key, options = { path: '/' }) => {
    setCookie(key, getCookie(key), { ...options, 'max-age': 0 });
};
