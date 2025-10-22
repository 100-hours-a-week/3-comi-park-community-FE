import { generateProfileImageHtml } from '../image/image.js';

export const generateWriterInfoHtml = (member) => {
    return `
        <div class="writer-info" style="display:flex; align-items:center; gap: 0.5em;">
            <div class="writer-member-image">${generateProfileImageHtml(member.image)}</div>
            <div class="writer-member-nickname">${member.nickname}</div>
        </div>`;
};
