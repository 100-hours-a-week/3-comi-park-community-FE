import { request, METHOD } from './request.js';

export const requestLogin = (email, password) => {
    return request({ method: METHOD.POST, url: '/auth', body: { email, password } });
};

export const requestLogout = () => {
    return request({ method: METHOD.DELETE, url: '/auth' });
};
