import { requestCancelLike, requestCreateLike } from '../api/post-like.js';
import { requestReadPost, requestDeletePost } from '../api/posts.js';
import { requestComments } from '../api/comments.js';
import { paintCommentsContainer } from '../component/comments/comments.js';
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

const postLikeCountContainerClickHandler = async (target, postId) => {
    const previoustIsLiked = target.dataset.isliked === 'true';
    const request = previoustIsLiked === true ? requestCancelLike : requestCreateLike;

    const res = await request(postId);

    if (!res.success) {
        alert(res.data);
        return;
    }

    target.dataset.isliked = !previoustIsLiked;
    target.firstElementChild.textContent = res.data.likeCount;
};

document.addEventListener('DOMContentLoaded', async () => {
    const postId = Number(window.location.pathname.split('/').at(2));
    const postRes = await requestReadPost(postId);

    if (!postRes.success) {
        document.querySelector('section').textContent = postRes.data;
        return;
    }

    paintPostReadContainer(postRes.data.post);

    document.querySelector('.post-delete-btn').addEventListener('click', ({ target }) => {
        deleteBtnClickHandler(target);
    });

    document.querySelector('.post-like-count-container').addEventListener('click', ({ currentTarget }) => {
        postLikeCountContainerClickHandler(currentTarget, postId);
    });

    /* 댓글 */
    const commentRes = await requestComments(postId);

    if (!commentRes.success) {
        document.querySelector('.comments-container').textContent = commentRes.data;
        return;
    }

    paintCommentsContainer(commentRes.data.comments);
});
