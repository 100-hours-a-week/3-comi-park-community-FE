export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params.entries()) {
        if (!result[key]) {
            result[key] = value;
            continue;
        }

        // 배열 처리
        if (Array.isArray(result[key])) {
            result[key].push(value);
        } else {
            result[key] = [result[key], value];
        }
    }

    return result;
};

/**
 * lastPostId와 limit 필드로만 쿼리 스트링을 구성합니다
 * 단, lastPostId 혹은 limit이 숫자나 문자열 숫자일 때만 유효한 값으로 인정합니다
 */
export const createPostQueryParams = (params) => {
    const validatedParams = {};

    if (!!params?.lastPostId && !isNaN(params.lastPostId)) {
        validatedParams.lastPostId = params.lastPostId;
    }

    if (!!params?.limit && !isNaN(params.limit)) {
        validatedParams.limit = params.limit;
    }

    if (!!params?.editMode) {
        validatedParams.editMode = params.editMode;
    }

    return new URLSearchParams(validatedParams).toString();
};

/**
 * lastCommentId와 limit 필드로만 쿼리 스트링을 구성합니다
 * 단, lastCommentId 혹은 limit이 숫자나 문자열 숫자일 때만 유효한 값으로 인정합니다
 */
export const createCommentQueryParams = (params) => {
    const validatedParams = {};

    if (!!params?.lastCommentId && !isNaN(params.lastCommentId)) {
        validatedParams.lastCommentId = params.lastCommentId;
    }

    if (!!params?.limit && !isNaN(params.limit)) {
        validatedParams.limit = params.limit;
    }

    return new URLSearchParams(validatedParams).toString();
};
