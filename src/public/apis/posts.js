import { createPostQueryParams } from '/utils/query-helper.js';
import { request, METHOD } from '/apis/request.js';

/**
 * 매개변수 params = { lastPostId: number, limit: number }
 * 그 외 다른 필드가 존재해도 검증을 통해 필요한 필드만 서버에 전송됩니다
 */
export const requestPosts = (params = {}) => {
    return request({ url: '/posts', params: createPostQueryParams(params) });
};

export const requestWritePost = (requestBody = {}) => {
    return request({ method: METHOD.POST, url: '/posts', body: requestBody });
};

export const requestReadPost = (postId, params = {}) => {
    return request({ url: `/posts/${postId}`, params: createPostQueryParams(params) });
};

export const requestUpdatePost = (postId, requestBody = { postDeleted: false, imageDeleted: false }) => {
    // 필수 전달 값 설정
    if (!requestBody?.postDeleted) {
        requestBody.postDeleted = false;
    }

    if (!requestBody?.imageDeleted) {
        requestBody.imageDeleted = false;
    }

    if (Object.hasOwn(requestBody, 'image') && requestBody.image == null) {
        requestBody.imageDeleted = true;
    }

    return request({ method: METHOD.PATCH, url: `/posts/${postId}`, body: requestBody });
};

export const requestDeletePost = (postId) => {
    return request({ method: METHOD.PATCH, url: `/posts/${postId}`, body: { postDeleted: true, imageDeleted: false } });
};
