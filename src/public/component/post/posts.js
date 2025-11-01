import { formatDate, formatCount } from '../../utils/format-helper.js';
import { generateProfileImageHtml } from '../common/image/image.js';

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
                    <div class="writer-info">
                        <div class="writer-member-image">
                        ${generateProfileImageHtml(post.member.image?.url)}
                        </div>
                        <div class="writer-member-nickname">${post.member.nickname}</div>
                    </div>

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
