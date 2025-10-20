import { formatCount, formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { getCookie } from '../../utils/cookie-helper.js';
import { validateRequiredInput, validatePostTitlePattern, validatePostContentPattern } from '../common/form/form.js';
import { requestWritePost, requestUpdatePost } from '../../api/posts.js';

export const paintPostForm = (post = {}) => {
    document.querySelector('section').insertAdjacentHTML('beforeend', generatePostFormHtml(post));

    const formTitleInput = document.querySelector('#form-title-input');
    const formContentInput = document.querySelector('#form-content-input');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    formTitleInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('title', target);
    });

    formContentInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('content', target);
    });

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

/* Event */
const validationRules = {
    title: {
        validateFunc: validatePostTitlePattern,
    },
    content: {
        validateFunc: validatePostContentPattern,
    },
};

const ChangeFormSubmitBtnStatus = () => {
    const formTitleInput = document.querySelector('#form-title-input');
    const formContentInput = document.querySelector('#form-content-input');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    if (formTitleInput.dataset.validated === 'true' && formContentInput.dataset.validated === 'true') {
        formSubmitBtn.classList.remove('inactivated');
    } else {
        formSubmitBtn.classList.add('inactivated');
    }
};

const formInputKeyUpHandler = (name, target) => {
    const title = target.value;
    const helper = target.nextElementSibling;

    const previousIsChanged = target.dataset.ischanged === 'true';

    // 수정 여부 판단
    if (!previousIsChanged) {
        target.dataset.ischanged = true;
    }

    const previousValidated = target.dataset.validated === 'true';
    const result = validationRules[name].validateFunc(title);

    if (previousValidated == result.isValidated) {
        return;
    }

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;

    ChangeFormSubmitBtnStatus();
};

const formSubmitBtnClickHandler = async (postId) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    const title = form.querySelector('#form-title-input');
    const content = form.querySelector('#form-content-input');

    if (title.dataset.validated !== 'true' || content.dataset.validated !== 'true') {
        return;
    }

    const requestBody = {};

    if (title.dataset.ischanged === 'true') {
        requestBody.title = title.value;
    }

    if (content.dataset.ischanged === 'true') {
        requestBody.content = content.value;
    }

    const res = !!postId ? await requestUpdatePost(postId, requestBody) : await requestWritePost(requestBody);

    if (!res.success) {
        content.nextElementSibling.textContent = res.data;
        return;
    }

    location.href = `/read/${!!postId ? postId : res.data.post.id}`;
};
