import { formatDate } from '../../utils/formatHelper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

const generateCommentContainerHTML = (comment) => {
    // TODO: 회원 이미지 가져오기
    return `
        <div class="comment-container">
            <div class="comment-info">
                <div class="comment-info-left">
                    ${generateWriterInfoHtml(comment.member)}
                    <div class="comment-created-at">${formatDate(comment.createdAt)}</div>
                </div>
                <div>
                    <button class="btn small-btn" data-id=${comment.id}>수정</button>
                    <button class="btn small-btn delete-btn" data-domain="댓글" data-id="${comment.id}">삭제</button>
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>`;
};
const generateCommentsContainerHTML = (comments) => {
    const commentContainer = comments.map((comment) => generateCommentContainerHTML(comment)).join('');
    return `
        <div class="comments-container">
            ${commentContainer}
        </div>`;
};

export const paintCommentsContainer = (comments) => {
    document
        .querySelector('.comments-container')
        .insertAdjacentHTML('beforeend', generateCommentsContainerHTML(comments));
};
