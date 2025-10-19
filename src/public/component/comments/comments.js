import { formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { getCookie } from '../../utils/cookie-helper.js';

const generateCommentContainerHtml = (comment) => {
    const updateDeleteBtnHtml = () => {
        return `
            <div>
                <button class="btn small-btn" data-id=${comment.id}>수정</button>
                <button class="btn small-btn delete-btn" data-domain="comment" data-id="${comment.id}">삭제</button>
            </div>`;
    };

    const loginMember = getCookie('loginMember');

    // TODO: 회원 이미지 가져오기
    return `
        <div class="comment-container" data-commentid="${comment.id}">
            <div class="comment-info">
                <div class="comment-info-left">
                    ${generateWriterInfoHtml(comment.member)}
                    <div class="comment-created-at">${formatDate(comment.createdAt)}</div>
                </div>
                ${loginMember == comment.member.id ? updateDeleteBtnHtml() : ''}
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>`;
};
const generateCommentsContainerHtml = (comments) => {
    return comments.map((comment) => generateCommentContainerHtml(comment)).join('');
};

export const paintCommentsContainer = (comments) => {
    document
        .querySelector('.comments-container')
        .insertAdjacentHTML('beforeend', generateCommentsContainerHtml(comments));
};
