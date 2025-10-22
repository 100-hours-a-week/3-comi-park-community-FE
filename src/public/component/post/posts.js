import { formatDate, formatCount } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

const generatePostContainerHtml = (post) => {
    return `
        <div class="post-container" data-postId="${post.id}">
            <div class="post">
                <div class="post-title">${post.title}</div>
                <div class="post-info">
                    <div class="post-stat">
                        <div>좋아요 <span class="post-like-count">${formatCount(post.likeCount)}</div>
                        <div>댓글 <span class="post-comment-count">${formatCount(post.commentCount)}</div>
                        <div>조회수 <span class="post-view-count">${formatCount(post.viewCount)}</div>
                    </div>
                    <div class="post-created-at">${formatDate(post.createdAt)}</div>
                </div>
            </div>
            <div class="custom-hr"></div>
            ${generateWriterInfoHtml(post.member)}
        </div>`;
};

const generatePostsContainerHtml = (posts) => {
    return posts.map((post) => generatePostContainerHtml(post)).join('');
};

export const paintPostContainer = (posts) => {
    document.querySelector('.posts-container').insertAdjacentHTML('beforeend', generatePostsContainerHtml(posts));
};
