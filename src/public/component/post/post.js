import { formatCount, formatDate } from '../../utils/formatHelper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

export const paintPostForm = (post = {}) => {
    document.querySelector('section').insertAdjacentHTML('beforeend', generatePostFormHtml(post));
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
                    data-validated="false"
                    value="${post?.title ?? ''}"
                />
                <div class="form-helper-text form-helper-title">제목을 작성해주세요</div>
            </div>
            <div>
                <label for="form-content-input" class="form-label">내용*</label>
                <textarea
                    name="내용"
                    class="form-input required"
                    id="form-content-input"
                    placeholder="내용을 입력해주세요."
                    data-validated="false"
                    rows="25"
                >${post?.content ?? ''}</textarea>
                <div class="form-helper-text form-helper-content">내용을 작성해주세요</div>
            </div>
            <div>
                <label for="form-file-input" class="form-label">이미지</label>
                <input name="이미지" type="file" class="" id="form-file-input" />
            </div>
            <div>
                <button class="btn form-submit-btn inactivated" type="button">완료</button>
            </div>
        </form>`;
};

// 게시글 상세조회 HTML
const generatePostReadContainerHtml = (post) => {
    // TODO: 게시글 이미지 가져오기

    return `
        <div class="post-title">${post.title}</div>
        <div class="post-info">
            <div class="post-info-left">
                ${generateWriterInfoHtml(post.member)}
                <div class="post-created-at">${formatDate(post.createdAt)}</div>
            </div>
            <div>
                <button class="btn small-btn"><a href="/update/${post.id}">수정</a></button>
                <button class="btn small-btn post-delete-btn" data-domain='게시글' data-id="${post.id}">삭제</button>
            </div>
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
