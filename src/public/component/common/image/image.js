import { getCookie, setCookie } from '../../../utils/cookie-helper.js';
import { requestMemberInfo } from '../../../api/members.js';

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
    const savedLoginMemberImageUrl = image?.url ?? '/assets/default-profile-image.png';
    setCookie('loginMemberImageUrl', savedLoginMemberImageUrl);

    return savedLoginMemberImageUrl;
};

export const generateProfileImageHtml = (imageUrl, size = { width: 50, height: 50 }) => {
    return `
        <img
            src="${imageUrl ?? '/assets/default-profile-image.png'}"
            class="round-image"
            width=${size.width}
            height=${size.height}
            alt="profile image"
            style="clip-path: circle(50%); object-fit: cover;"
        />
    `;
};

export const generatePostImageHtml = (imageUrl) => {
    return !!imageUrl
        ? `<img
            src="${imageUrl}"
            alt="post image"
            style="width: 100%"
        />`
        : '';
};

export const generateHeaderProfileImageHtml = async (memberId, size = { width: 50, height: 50 }) => {
    const loginMemberImageUrl = await getLoginMemberImageUrl(memberId);
    return generateProfileImageHtml(loginMemberImageUrl, size);
};
