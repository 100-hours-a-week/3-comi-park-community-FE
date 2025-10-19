import { request, METHOD } from './request.js';

/**
 * 매개변수 params = { lastCommentId: number, limit: number }
 * 그 외 다른 필드가 존재해도 검증을 통해 필요한 필드만 서버에 전송됩니다
 */
export const requestComments = (postId, params = {}) => {
    return request({ url: `/posts/${postId}/comments`, params: createQueryString(params) });
};

export const requestDeleteComment = (commentId) => {
    const postId = Number(window.location.pathname.split('/').at(2));
    return request({ method: METHOD.DELETE, url: `/posts/${postId}/comments/${commentId}` });
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
