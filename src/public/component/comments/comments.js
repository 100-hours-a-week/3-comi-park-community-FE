import { validateRequiredInput, ChangeFormSubmitBtnStatus, validateField } from '../common/form/form.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { debouncedRequest } from '../../utils/debounce-helper.js';
import { formatDate } from '../../utils/format-helper.js';
import { requestUpdateComment, requestWriteComment } from '../../api/comments.js';

const generateCommentFormHtml = (comment) => {
    return `
        <form class="form">
            <div>
                <textarea
                    name="댓글"
                    class="form-input required"
                    id="form-content-input"
                    placeholder="댓글을 입력해주세요."
                    data-validated="${comment?.content ? 'true' : 'false'}"
                    data-ischanged="false"
                    data-fieldname="content"
                    data-keyname="commentContent"
                    rows="10"
                >${comment?.content ?? ''}</textarea>
                <div class="form-helper-text form-helper-content"></div>
            </div>
            <div>
                <button class="btn form-submit-btn ${comment?.id ? '' : 'inactivated'}" type="button">완료</button>
            </div>
        </form>`;
};

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

export const formSubmitBtnClickHandler = async (commentId) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    // 유효성 검사 통과 못하면 return
    const inputElementsWithValidated = document.querySelectorAll('[data-validated]');

    for (const e of inputElementsWithValidated) {
        if (e.dataset.validated !== 'true') return;
    }

    const inputElements = document.querySelectorAll('.form-input');
    const requestBody = {};

    for (const e of inputElements) {
        requestBody[e.dataset.fieldname] = e.value;
    }

    const res = !!commentId
        ? await requestUpdateComment(commentId, requestBody)
        : await requestWriteComment(requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }

    document.querySelector('.post-comment-count').textContent = res.data.commentCount;
    document
        .querySelector('.comments-container')
        .insertAdjacentHTML('afterbegin', generateCommentContainerHtml(res.data.comment, res.data.comment.member.id));
    document.querySelector('#form-content-input').value = '';
};

export const paintCommentFormContainer = (comment = {}) => {
    document.querySelector('.comment-form-container').insertAdjacentHTML('beforeend', generateCommentFormHtml(comment));

    document.querySelectorAll('.form-input').forEach((e) =>
        e.addEventListener(
            'input',
            debouncedRequest(function ({ target }) {
                validateField(target.dataset.keyname, target);
                ChangeFormSubmitBtnStatus();
            }, 400)
        )
    );

    document.querySelector('.form-submit-btn').addEventListener('click', () => {
        formSubmitBtnClickHandler(comment?.id);
    });
};

export const paintCommentsContainer = (comments, loginMemberId) => {
    document
        .querySelector('.comments-container')
        .insertAdjacentHTML('beforeend', generateCommentsContainerHtml(comments, loginMemberId));
};
