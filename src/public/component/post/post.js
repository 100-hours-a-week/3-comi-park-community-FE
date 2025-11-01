import { formatCount, formatDate } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';
import { generatePostImageHtml } from '../common/image/image.js';

export const paintPostReadContainer = (post, loginMemberId) => {
    document
        .querySelector('.post-container')
        .insertAdjacentHTML('beforeend', generatePostReadContainerHtml(post, loginMemberId));
};

/* HTML */
// 게시글 상세조회 HTML
const generatePostReadContainerHtml = (post, loginMemberId) => {
    const updateDeleteBtnHtml = () => {
        return `
            <div class="btn-container">
                <button class="small-btn" onclick="location.href='/update/${post.id}'">수정</button>
                <button class="small-btn delete-btn" data-domain='post' data-id="${post.id}">삭제</button>
            </div>`;
    };

    return `
        <div class="post-title">${post.title}</div>
        <div class="post-info">
            ${generateWriterInfoHtml(post.member)}
            <div class="post-created-at">${formatDate(post.createdAt)}</div>
        </div>
        ${loginMemberId === post.member.id ? updateDeleteBtnHtml() : ''}
        <div class="custom-hr"></div>
        <div class="post-image">
            ${generatePostImageHtml(post.image?.url)} 
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-stat-container">
            <div class="post-stat post-like-count-container" data-isLiked="${post.liked}">
                <div class="post-like-count">${formatCount(post.likeCount)}</div>
                <div>좋아요 💖</div>
            </div>
            <div class="post-stat">
                <div class="post-view-count">${formatCount(post.viewCount)}</div>
                <div>조회수 💬</div>
            </div>
            <div class="post-stat">
                <div class="post-comment-count">${formatCount(post.commentCount)}</div>
                <div>댓글 🔎</div>
            </div>
        </div>`;
};
