import { API_SERVER_URI } from '../utils/constants.js';

/**
 * 매개변수 params = { lastCommentId: number, limit: number }
 * 그 외 다른 필드가 존재해도 검증을 통해 필요한 필드만 서버에 전송됩니다
 */
export const requestComments = async (postId, params = {}) => {
    try {
        const res = await fetch(`${API_SERVER_URI}/posts/${postId}/comments?${createQueryString(params)}`, {
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

export const requestDeleteComment = async (commentId) => {
    const postId = Number(window.location.pathname.split('/').at(2));

    try {
        const res = await fetch(`${API_SERVER_URI}/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
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

/**
 * lastCommentId와 limit 필드로만 쿼리 스트링을 구성합니다
 * 단, lastCommentId 혹은 limit이 숫자나 문자열 숫자일 때만 유효한 값으로 인정합니다
 */
const createQueryString = (params) => {
    const validatedParams = {};

    if (!!params?.lastCommentId && !isNaN(params.lastCommentId)) {
        validatedParams.lastCommentId = params.lastCommentId;
    }

    if (!!params?.limit && !isNaN(params.limit)) {
        validatedParams.limit = params.limit;
    }

    return new URLSearchParams(validatedParams).toString();
};
