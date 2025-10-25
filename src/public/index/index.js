import { paintHeader } from '../component/common/header/header.js';
import { paintPostContainer } from '../component/post/posts.js';
import { requestPosts } from '../api/posts.js';
import { getAuth } from '../utils/auth-guard.js';

const postsContainerClickHandler = (target) => {
    const postContainer = target.closest('.post-container');

    if (!postContainer) return;

    const postId = postContainer.dataset.postid;
    location.href = `/read/${postId}`;
};

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    const res = await requestPosts();

    if (!res.success) {
        document.querySelector('.posts-container').textContent = res.data;
        return;
    }

    paintPostContainer(res.data.posts);

    document.querySelector('.posts-container').addEventListener('click', ({ target }) => {
        postsContainerClickHandler(target);
    });
});
