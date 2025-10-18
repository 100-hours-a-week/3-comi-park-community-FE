import { requestPosts } from '../api/posts.js';
import { formatDate, formatCount } from '../utils/formatHelper.js';

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
            <div class="post-member">
                <div class="post-member-image">${post.member.image?.id ?? '👤'}</div>
                <div class="post-member-name">${post.member.nickname}</div>
            </div>
        </div>`;
    // TODO: post.member.image.id 있으면 프로필 이미지 가져오기
};

const generatePostsContainerHtml = (posts) => {
    return posts.map((post) => generatePostContainerHtml(post)).join('');
};

const paintPostContainer = async () => {
    const postsContainer = document.querySelector('.posts-container');
    const res = await requestPosts();

    if (!res.success) {
        postsContainer.textContent = res.data;
        return;
    }

    postsContainer.insertAdjacentHTML('beforeend', generatePostsContainerHtml(res.data.posts));
};

const postsContainerClickHandler = (target) => {
    const postContainer = target.closest('.post-container');

    if (!postContainer) return;

    const postId = postContainer.dataset.postid;
    location.href = `/posts/${postId}`;
};

document.addEventListener('DOMContentLoaded', async () => {
    paintPostContainer();

    document.querySelector('.posts-container').addEventListener('click', ({ target }) => {
        postsContainerClickHandler(target);
    });
});
