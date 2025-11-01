import { formatDate, formatCount } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

const generatePostContainerHtml = (post) => {
    return `
        <div class="post-container" data-postid="${post.id}" onclick="location.href='/read/${post.id}'">
            <div class="post">
                <div class="post-header">
                <div class="post-title">${post.title}</div>
                <div class="post-created-at">${formatDate(post.createdAt)}</div>
                </div>

                <div class="custom-hr"></div>

                <div class="post-footer">
                    ${generateWriterInfoHtml(post.member)}

                    <div class="post-stat">
                        <div>💖 <span class="post-like-count">${formatCount(post.likeCount)}</span></div>
                        <div>💬 <span class="post-comment-count">${formatCount(post.commentCount)}</span></div>
                        <div>🔎 <span class="post-view-count">${formatCount(post.viewCount)}</span></div>
                    </div>
                </div>
            </div>
        </div>`;
};

const generatePostsContainerHtml = (posts) => {
    return posts.map((post) => generatePostContainerHtml(post)).join('');
};

export const paintPostContainer = (posts) => {
    document.querySelector('.posts-container').insertAdjacentHTML('beforeend', generatePostsContainerHtml(posts));
};
