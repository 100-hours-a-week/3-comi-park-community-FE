import { request, METHOD } from './request.js';

export const requestLogin = (requestBody = { email: '', password: '' }) => {
    return request({ method: METHOD.POST, url: '/auth', body: requestBody });
};

export const requestLogout = () => {
    return request({ method: METHOD.DELETE, url: '/auth' });
};
