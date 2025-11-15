import { request, METHOD } from '/apis/request.js';

export const requestMemberImageUpload = async (requestBody) => {
    return request({ method: METHOD.POST, url: '/images/members', body: requestBody, isFormData: true });
};

export const requestPostImageUpload = async (requestBody) => {
    return request({ method: METHOD.POST, url: '/images/posts', body: requestBody, isFormData: true });
};

export const requestImageUpload = async (domain, requestBody) => {
    return request({ method: METHOD.POST, url: `/images/${domain}`, body: requestBody, isFormData: true });
};
