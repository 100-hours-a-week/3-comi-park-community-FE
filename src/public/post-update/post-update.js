import { paintPostForm } from '../component/post/post.js';
import { requestReadPost } from '../api/posts.js';
import { getAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    const postId = Number(window.location.pathname.split('/').at(2));
    const res = await requestReadPost(postId);

    if (!res.success) {
        document.querySelector('section').textContent = res.data;
        return;
    }

    paintPostForm(res.data.post);
});
