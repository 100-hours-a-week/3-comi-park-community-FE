import { request, METHOD } from './request.js';

const url = '/auth/jwt';

export const requestLogin = (requestBody = { email: '', password: '' }) => {
    return request({ method: METHOD.POST, url, body: requestBody });
};

export const requestLogout = () => {
    return request({ method: METHOD.DELETE, url });
};

export const requestAuth = () => {
    return request({ url });
};

export const requestRefresh = () => {
    return request({ method: METHOD.POST, url: `${url}/refresh` });
};
