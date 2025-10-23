import { formatCount, formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { getCookie } from '../../utils/cookie-helper.js';
import { validateRequiredInput, ChangeFormSubmitBtnStatus, validateField } from '../common/form/form.js';
import { requestWritePost, requestUpdatePost } from '../../api/posts.js';
import { debouncedRequest } from '../../utils/debounce-helper.js';
import { API_SERVER_URI } from '../../utils/constants.js';
import { generatePostImageHtml } from '../common/image/image.js';
import { requestPostImageUpload } from '../../api/images.js';

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

    const formPostImageElement = document.querySelector('.form-post-image');

    document.querySelector('.form-image-add-btn').addEventListener('click', () => {
        document.querySelector('.form-post-image-hidden').click();
    });

    document.querySelector('.form-image-delete-btn').addEventListener('click', ({ target }) => {
        document.querySelector('.form-post-image-hidden').value = '';
        formPostImageElement.value = '이미지가 없습니다';
        formPostImageElement.dataset.ischanged = true;
        formPostImageElement.dataset.image = null;

        ChangeFormSubmitBtnStatus();
    });

    document.querySelector('.form-post-image-hidden').addEventListener('change', async ({ target }) => {
        const file = target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await requestPostImageUpload(formData);

        if (!res.success) {
            console.error(res.data);
        } else {
            console.log('업로드');
            formPostImageElement.value = res.data.image.filename;
            formPostImageElement.dataset.ischanged = true;
            formPostImageElement.dataset.image = JSON.stringify({
                id: res.data.image.id,
                objectKey: res.data.image.objectKey,
            });
        }
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
                <label for="form-image-input" class="form-label">이미지</label>
                <input type="text" class="form-input form-post-image" value="${post?.image?.filename ?? '이미지가 없습니다'}" disabled />
                <div class="form-post-image-container">
                    <button type="button" class="btn purple form-image-add-btn">변경</button>
                    <button type="button" class="btn purple form-image-delete-btn">삭제</button>
                </div>
                <input
                    name="이미지"
                    type="file"
                    class="form-post-image-hidden"
                    id="form-image-input"
                    style="display: none"
                />
                <div class="form-helper-text form-helper-image"></div>
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
        <div class="post-image">
            ${generatePostImageHtml(post.image)} 
        </div>
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
    const formProfileImageElement = document.querySelector('.form-post-image');
    const requestBody = {};

    if (formProfileImageElement.dataset.ischanged === 'true') {
        requestBody.image = JSON.parse(formProfileImageElement.dataset.image);
    }

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
