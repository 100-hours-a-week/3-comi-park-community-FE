import { requestReadPost, requestDeletePost } from '../api/posts.js';
import { paintPostReadContainer } from '../component/post/post.js';

const deleteBtnClickHandler = async (target) => {
    // TODO: 모달창 띄우기
    if (!confirm(`${target.dataset.domain} 삭제하시겠습니까? 삭제한 내용은 복구할 수 없습니다`)) {
        return;
    }

    const res = await requestDeletePost(target.dataset.id);

    if (!res.success) {
        alert(res.data);
        return;
    }

    location.href = '/index';
};
document.addEventListener('DOMContentLoaded', async () => {
    const postId = Number(window.location.pathname.split('/').at(2));
    const res = await requestReadPost(postId);

    if (!res.success) {
        document.querySelector('section').textContent = res.data;
        return;
    }

    paintPostReadContainer(res.data.post);

    document.querySelector('.post-delete-btn').addEventListener('click', ({ target }) => {
        deleteBtnClickHandler(target);
    });
});
