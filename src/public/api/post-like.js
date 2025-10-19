import { request, METHOD } from './request.js';

export const requestCreateLike = (postId) => {
    return request({ method: METHOD.POST, url: `/posts/${postId}/likes` });
};

export const requestCancelLike = (postId) => {
    return request({ method: METHOD.DELETE, url: `/posts/${postId}/likes` });
};
