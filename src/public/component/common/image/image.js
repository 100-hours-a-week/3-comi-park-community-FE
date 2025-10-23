import { requestMemberInfo } from '../../../api/members.js';
import { API_SERVER_URI } from '../../../utils/constants.js';

const requestMemberImage = async (memberId) => {
    const res = await requestMemberInfo(memberId);

    if (!res.success) {
        console.error(res.data);
        return null;
    }

    return res.data.member.image;
};

export const generatePostImageHtml = (image) => {
    return !!image
        ? `<img
            src="${API_SERVER_URI}/s3/${image.objectKey}"
            alt="post image"
            style="width: 100%"
        />`
        : '';
};

export const generateProfileImageHtml = (image, size = { width: 50, height: 50 }) => {
    return `
        <img
            src="${!!image ? `${API_SERVER_URI}/s3/${image.objectKey}` : '/assets/default-profile-image.png'}"
            width=${size.width}
            height=${size.height}
            alt="profile image"
            style="clip-path: circle(50%); object-fit: cover;"
        />
    `;
};

export const paintProfileImage = async (memberId, size = { width: 50, height: 50 }) => {
    const image = await requestMemberImage(memberId);
    document.querySelector('.profile-image').insertAdjacentHTML('beforeend', generateProfileImageHtml(image, size));
};
