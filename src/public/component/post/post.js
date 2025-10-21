import { formatCount, formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { getCookie } from '../../utils/cookie-helper.js';
import { validateRequiredInput, ChangeFormSubmitBtnStatus, validateField } from '../common/form/form.js';
import { requestWritePost, requestUpdatePost } from '../../api/posts.js';
import { debouncedRequest } from '../../utils/debounce-helper.js';

export const paintPostForm = (post = {}) => {
    document.querySelector('section').insertAdjacentHTML('beforeend', generatePostFormHtml(post));

    const formSubmitBtn = document.querySelector('.form-submit-btn');

    document.querySelectorAll('.form-input').forEach((e) =>
        e.addEventListener(
            'input',
            debouncedRequest(function ({ target }) {
                validateField(target.dataset.fieldname, target);
                ChangeFormSubmitBtnStatus();
            }, 400)
        )
    );

    formSubmitBtn.addEventListener('click', () => {
        formSubmitBtnClickHandler(post?.id);
    });
};

export const paintPostReadContainer = (post) => {
    document.querySelector('.post-container').insertAdjacentHTML('beforeend', generatePostReadContainerHtml(post));
};

/* HTML */
// 게시글 작성/수정 HTML
const generatePostFormHtml = (post) => {
    return `
        <div class="title">게시글 ${post?.id ? '수정' : '작성'}</div>
        <form class="form">
            <div>
                <label for="form-title-input" class="form-label">제목*</label>
                <input
                    name="제목"
                    type="input"
                    class="form-input required"
                    id="form-title-input"
                    placeholder="제목을 입력해주세요. (최대 26글자)"
                    data-validated="${post?.title ? 'true' : 'false'}"
                    data-ischanged="false"
                    data-fieldname="title"
                    value="${post?.title ?? ''}"
                />
                <div class="form-helper-text form-helper-title">${post?.title ? '' : '제목을 작성해주세요'}</div>
            </div>
            <div>
                <label for="form-content-input" class="form-label">내용*</label>
                <textarea
                    name="내용"
                    class="form-input required"
                    id="form-content-input"
                    placeholder="내용을 입력해주세요."
                    data-validated="${post?.content ? 'true' : 'false'}"
                    data-ischanged="false"
                    data-fieldname="content"
                    rows="25"
                >${post?.content ?? ''}</textarea>
                <div class="form-helper-text form-helper-content">${post?.title ? '' : '내용을 작성해주세요'}</div>
            </div>
            <div>
                <label for="form-file-input" class="form-label">이미지</label>
                <input name="이미지" type="file" class="" id="form-file-input" data-ischanged="false" />
            </div>
            <div>
                <button class="btn form-submit-btn ${post?.id ? '' : 'inactivated'}" type="button">완료</button>
            </div>
        </form>`;
};

// 게시글 상세조회 HTML
const generatePostReadContainerHtml = (post) => {
    const updateDeleteBtnHtml = () => {
        return `
            <div>
                <button class="btn small-btn"><a href="/update/${post.id}">수정</a></button>
                <button class="btn small-btn delete-btn" data-domain='post' data-id="${post.id}">삭제</button>
            </div>`;
    };

    const loginMember = getCookie('loginMember');

    // TODO: 게시글 이미지 가져오기

    return `
        <div class="post-title">${post.title}</div>
        <div class="post-info">
            <div class="post-info-left">
                ${generateWriterInfoHtml(post.member)}
                <div class="post-created-at">${formatDate(post.createdAt)}</div>
            </div>
            ${loginMember == post.member.id ? updateDeleteBtnHtml() : ''}
        </div>
        <div class="custom-hr"></div>
        <div class="post-image"></div>
        <div class="post-content">${post.content}</div>
        <div class="post-stat-container">
            <div class="post-stat post-like-count-container" data-isLiked="${post.liked}">
                <div class="post-like-count">${formatCount(post.likeCount)}</div>
                <div>좋아요수</div>
            </div>
            <div class="post-stat">
                <div class="post-view-count">${formatCount(post.viewCount)}</div>
                <div>조회수</div>
            </div>
            <div class="post-stat">
                <div class="post-comment-count">${formatCount(post.commentCount)}</div>
                <div>댓글</div>
            </div>
        </div>`;
};

const formSubmitBtnClickHandler = async (postId) => {
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
        if (e.dataset.ischanged === 'true') {
            requestBody[e.dataset.fieldname] = e.value;
        }
    }

    const res = !!postId ? await requestUpdatePost(postId, requestBody) : await requestWritePost(requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }

    location.href = `/read/${!!postId ? postId : res.data.post.id}`;
};
