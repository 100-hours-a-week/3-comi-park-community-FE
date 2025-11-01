import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { paintPostContainer } from '../component/post/posts.js';
import { requestPosts } from '../api/posts.js';
import { getAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    const postsContainerElement = mainElement.querySelector('.posts-container');

    const res = await requestPosts();

    if (!res.success) {
        postsContainerElement.textContent = res.data;
        return;
    }

    paintPostContainer(res.data.posts);

    paintFooter(bodyElement, mainElement);

    let isNewPostFetching = false;
    const postElements = Array.from(postsContainerElement.querySelectorAll('[data-postid]'));
    let lastPostId = postElements.length > 0 ? postElements.at(-1).dataset.postid : -1;

    window.addEventListener('scroll', async () => {
        if (lastPostId === -1) return;

        const hitsBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

        if (!hitsBottom || isNewPostFetching) {
            return;
        }

        isNewPostFetching = true;

        const res = await requestPosts({ lastPostId });

        if (!res.success) {
            // TODO: 오른쪽 상단에 토스 메시지 띄우기
            alert(res.data);
            return;
        }

        if (res.data.posts.length === 0 || res.data.posts.at(-1).id === lastPostId) {
            lastPostId = -1;
            return;
        }

        lastPostId = res.data.posts.at(-1).id;
        paintPostContainer(res.data.posts);
        isNewPostFetching = false;
    });
});
