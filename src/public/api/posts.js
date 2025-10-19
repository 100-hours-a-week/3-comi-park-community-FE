import { request, METHOD } from './request.js';

/**
 * 매개변수 params = { lastPostId: number, limit: number }
 * 그 외 다른 필드가 존재해도 검증을 통해 필요한 필드만 서버에 전송됩니다
 */
export const requestPosts = (params = {}) => {
    return request({ url: '/posts', params: createQueryString(params) });
};

export const requestWritePost = (requestBody = {}) => {
    return request({ method: METHOD.POST, url: '/posts', body: requestBody });
};

export const requestReadPost = (postId) => {
    return request({ url: `/posts/${postId}` });
};

export const requestDeletePost = (postId) => {
    return request({ method: METHOD.PATCH, url: `/posts/${postId}`, body: { postDeleted: true, imageDeleted: false } });
};

/**
 * lastPostId와 limit 필드로만 쿼리 스트링을 구성합니다
 * 단, lastPostId 혹은 limit이 숫자나 문자열 숫자일 때만 유효한 값으로 인정합니다
 */
const createQueryString = (params) => {
    const validatedParams = {};

    if (!!params?.lastPostId && !isNaN(params.lastPostId)) {
        validatedParams.lastPostId = params.lastPostId;
    }

    if (!!params?.limit && !isNaN(params.limit)) {
        validatedParams.limit = params.limit;
    }

    return new URLSearchParams(validatedParams).toString();
};
