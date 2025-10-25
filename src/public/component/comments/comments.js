import { formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

const generateCommentContainerHtml = (comment, loginMemberId) => {
    const updateDeleteBtnHtml = () => {
        return `
            <div>
                <button class="btn small-btn" data-id=${comment.id}>수정</button>
                <button class="btn small-btn delete-btn" data-domain="comment" data-id="${comment.id}">삭제</button>
            </div>`;
    };

    return `
        <div class="comment-container" data-commentid="${comment.id}">
            <div class="comment-info">
                <div class="comment-info-left">
                    ${generateWriterInfoHtml(comment.member)}
                    <div class="comment-created-at">${formatDate(comment.createdAt)}</div>
                </div>
                ${loginMemberId == comment.member.id ? updateDeleteBtnHtml() : ''}
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>`;
};

const generateCommentsContainerHtml = (comments, loginMemberId) => {
    return comments.map((comment) => generateCommentContainerHtml(comment, loginMemberId)).join('');
};

export const paintCommentsContainer = (comments, loginMemberId) => {
    document
        .querySelector('.comments-container')
        .insertAdjacentHTML('beforeend', generateCommentsContainerHtml(comments, loginMemberId));
};
