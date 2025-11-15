import { generateWriterInfoHtml } from '/component/common/member/member.js';
import { requestUpdateComment } from '/apis/comments.js';
import { requestDeleteComment } from '/apis/comments.js';
import { paintForm } from '/component/common/form/form-painter.js';
import { formatDate } from '/utils/format-helper.js';
import { openModal } from '/component/common/modal/modal.js';

export const generateCommentContainerHtml = (comment, loginMemberId) => {
    const updateDeleteBtnHtml = () => {
        return `
            <div class="btn-container">
                <button class="small-btn comment-update-btn" data-id=${comment.id}>수정</button>
                <button class="small-btn comment-delete-btn" data-id="${comment.id}">삭제</button>
            </div>`;
    };

    return `
        <div class="comment-container" data-commentid="${comment.id}">
            <div class="comment-info">
                ${generateWriterInfoHtml(comment.member)}
                <div class="comment-created-at">${formatDate(comment.createdAt)}</div>
            </div>
            ${loginMemberId == comment.member.id ? updateDeleteBtnHtml() : ''}
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

export const attachCommentUpdateFormEventHandler = (commentsContainerElement, postCommentCountElement) => {
    // 삭제 버튼
    commentsContainerElement.addEventListener('click', ({ target }) => {
        if (!target.classList.contains('comment-delete-btn')) return;

        const id = target.dataset.id;
        const commentContainerElement = target.closest('.comment-container');

        openModal({
            mainText: '댓글을 삭제하시겠습니까?',
            subText: '삭제한 내용은 복구할 수 없습니다',
            dataset: target.dataset,
            onConfirm: async () => {
                await commentDeleteHandler(
                    id,
                    commentContainerElement,
                    commentsContainerElement,
                    postCommentCountElement
                );
            },
        });
    });

    // 수정 버튼
    commentsContainerElement.addEventListener('click', ({ target }) => {
        if (!target.classList.contains('comment-update-btn')) return;

        const commentContainerElement = target.closest('.comment-container');
        const commentContentElement = commentContainerElement.querySelector('.comment-content');

        const id = target.dataset.id;
        const content = commentContentElement.textContent;

        commentContentElement.textContent = '';

        paintForm({
            formParent: commentContentElement,
            fields: ['comment'],
            values: { comment: content },
            submitBtnValue: '수정',
            afterSubmit: async (requestBody) => {
                const res = await requestUpdateComment(id, requestBody);

                if (!res.success) {
                    // TODO: 오른쪽 상단에 토스 메시지 띄우기
                    alert(res.data);
                    return;
                }

                commentContentElement.textContent = res.data.changes.content;
            },
        });
    });
};

const commentDeleteHandler = async (id, commentContainerElement, commentsContainerElement, postCommentCountElement) => {
    const res = await requestDeleteComment(id);

    // TODO: 오른쪽 상단에 토스 메시지 띄우기
    if (!res.success) {
        alert(res.data);
        return;
    }

    commentsContainerElement.removeChild(commentContainerElement);
    postCommentCountElement.textContent = res.data.count;
};
