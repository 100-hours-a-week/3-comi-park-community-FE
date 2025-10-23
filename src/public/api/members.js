import { request, METHOD } from './request.js';

export const requestEmailDuplicationCheck = (email) => {
    return request({ method: METHOD.POST, url: '/members/availability/email', body: { email } });
};

export const requestNicknameDuplicationCheck = (nickname) => {
    return request({ method: METHOD.POST, url: '/members/availability/nickname', body: { nickname } });
};

export const requestRegister = (requestBody = {}) => {
    return request({ method: METHOD.POST, url: '/members', body: requestBody });
};

export const requestMemberInfo = (memberId) => {
    return request({ url: `/members/${memberId}` });
};

export const requestMemberInfoUpdate = (memberId, requestBody = { imageDeleted: false }) => {
    // 필수 전달 값 설정
    if (!requestBody?.imageDeleted) {
        requestBody.imageDeleted = false;
    }

    if (Object.hasOwn(requestBody, 'image') && requestBody.image == null) {
        requestBody.imageDeleted = true;
    }

    return request({ method: METHOD.PATCH, url: `/members/${memberId}`, body: requestBody });
};

export const requestMemberDelete = (memberId) => {
    return request({ method: METHOD.DELETE, url: `/members/${memberId}` });
};
