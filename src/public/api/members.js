import { request, METHOD } from './request.js';

export const requestEmailDuplicationCheck = (email) => {
    return request({ method: METHOD.POST, url: '/members/availability/email', body: { email } });
};

export const requestNicknameDuplicationCheck = (nickname) => {
    return request({ method: METHOD.POST, url: '/members/availability/nickname', body: { nickname } });
};

export const requestRegister = (requestBody = {}) => {
    return request({ method: METHOD.POST, url: '/members', body: requestBody });
};
