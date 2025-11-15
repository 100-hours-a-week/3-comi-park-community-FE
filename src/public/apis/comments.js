import { createCommentQueryParams, getQueryParams } from '/utils/query-helper.js';
import { request, METHOD } from '/apis/request.js';

/**
 * 매개변수 params = { lastCommentId: number, limit: number }
 * 그 외 다른 필드가 존재해도 검증을 통해 필요한 필드만 서버에 전송됩니다
 */
export const requestComments = (postId, params = {}) => {
    return request({ url: `/posts/${postId}/comments`, params: createCommentQueryParams(params) });
};

export const requestWriteComment = (requestBody = {}) => {
    const params = getQueryParams();
    const postId = Number(params.id);
    return request({ method: METHOD.POST, url: `/posts/${postId}/comments`, body: requestBody });
};

export const requestUpdateComment = (commentId, requestBody = {}) => {
    const params = getQueryParams();
    const postId = Number(params.id);
    return request({ method: METHOD.PATCH, url: `/posts/${postId}/comments/${commentId}`, body: requestBody });
};

export const requestDeleteComment = (commentId) => {
    const params = getQueryParams();
    const postId = Number(params.id);
    return request({ method: METHOD.DELETE, url: `/posts/${postId}/comments/${commentId}` });
};
