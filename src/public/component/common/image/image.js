import { getCookie, setCookie } from '../../../utils/cookie-helper.js';
import { requestMemberInfo } from '../../../api/members.js';
import { API_SERVER_URI } from '../../../utils/constants.js';

export const generatePostImageHtml = (image) => {
    return !!image
        ? `<img
            src="${API_SERVER_URI}/s3/${image.objectKey}"
            alt="post image"
            style="width: 100%"
        />`
        : '';
};

export const generateProfileImageHtml = async (imageUrl, size = { width: 50, height: 50 }) => {
    return `
        <img
            src="${imageUrl}"
            width=${size.width}
            height=${size.height}
            alt="profile image"
            style="clip-path: circle(50%); object-fit: cover;"
        />
    `;
};

export const paintProfileImage = async (imageUrl, size = { width: 50, height: 50 }) => {
    document.querySelector('.profile-image').insertAdjacentHTML('beforeend', generateProfileImageHtml(imageUrl, size));
};

// ////////// 리팩토링 중인 코드
const requestMemberImage = async (memberId) => {
    const res = await requestMemberInfo(memberId);

    if (!res.success) {
        console.error(res.data);
        return null;
    }

    return res.data.member.image;
};

const getLoginMemberImageUrl = async (memberId) => {
    const loginMemberImageUrl = getCookie('loginMemberImageUrl');

    if (!!loginMemberImageUrl) {
        return loginMemberImageUrl;
    }

    const image = await requestMemberImage(memberId);
    const savedLoginMemberImageUrl = !!image?.objectKey
        ? `${API_SERVER_URI}/s3/${image.objectKey}`
        : '/assets/default-profile-image.png';
    setCookie('loginMemberImageUrl', savedLoginMemberImageUrl);

    return savedLoginMemberImageUrl;
};

const generateProfileImage = (imageUrl, size) => {
    return `
        <img
            src="${imageUrl}"
            width=${size.width}
            height=${size.height}
            alt="profile image"
            style="clip-path: circle(50%); object-fit: cover;"
        />
    `;
};

export const generateHeaderProfileImageHtml = async (memberId, size = { width: 50, height: 50 }) => {
    const loginMemberImageUrl = await getLoginMemberImageUrl(memberId);
    return generateProfileImage(loginMemberImageUrl, size);
};
