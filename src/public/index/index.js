import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
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

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    paintFooter(bodyElement, mainElement);

    let isNewPostFetching = false;

    window.addEventListener('scroll', async () => {
        const hitsBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

        if (!hitsBottom || isNewPostFetching) {
            return;
        }

        isNewPostFetching = true;

        const lastPostId = Array.from(document.querySelectorAll('[data-postid]')).at(-1).dataset.postid;
        const res = await requestPosts({ lastPostId });

        if (!res.success) {
            document.querySelector('.posts-container').textContent = res.data;
            return;
        }

        paintPostContainer(res.data.posts);
        isNewPostFetching = false;
    });
});
