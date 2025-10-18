import { API_SERVER_URI } from '../utils/constants.js';

export const requestCreateLike = (postId) => {
    return requestLike(postId, 'POST');
};

export const requestCancelLike = async (postId) => {
    return requestLike(postId, 'DELETE');
};

const requestLike = async (postId, method) => {
    try {
        const res = await fetch(`${API_SERVER_URI}/posts/${postId}/likes`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error(error);
        return { success: false, data: '문제가 발생했습니다' };
    }
};
