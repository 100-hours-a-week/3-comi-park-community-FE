export const getCookie = (key) => {
    return document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${key}=`))
        ?.split('=')[1];
};
