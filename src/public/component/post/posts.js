import { formatDate, formatCount } from '../../utils/format-helper.js';
import { generateWriterInfoHtml } from '../common/member/member.js';

const generatePostContainerHtml = (data) => {
    return `
        <div class="post-container" data-postid="${data.post.id}" onclick="location.href='/read?id=${data.post.id}'">
            <div class="post">
                <div class="post-header">
                <div class="post-title">${data.post.title}</div>
                <div class="post-created-at">${formatDate(data.post.createdAt)}</div>
                </div>

                <div class="custom-hr"></div>

                <div class="post-footer">
                    ${generateWriterInfoHtml(data.post.member)}

                    <div class="post-stat">
                        <div>💖 <span class="post-like-count">${formatCount(data.likeCount)}</span></div>
                        <div>💬 <span class="post-comment-count">${formatCount(data.commentCount)}</span></div>
                        <div>🔎 <span class="post-view-count">${formatCount(data.viewCount)}</span></div>
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
