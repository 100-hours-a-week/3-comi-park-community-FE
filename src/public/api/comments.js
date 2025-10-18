import { API_SERVER_URI } from '../utils/constants.js';

export const requestComments = async (postId) => {
    try {
        const res = await fetch(`${API_SERVER_URI}/posts/${postId}/comments`, {
            method: 'GET',
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
