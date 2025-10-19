import { requestCancelLike, requestCreateLike } from '../api/post-like.js';
import { requestReadPost, requestDeletePost } from '../api/posts.js';
import { requestComments, requestDeleteComment } from '../api/comments.js';
import { paintCommentsContainer } from '../component/comments/comments.js';
import { paintPostReadContainer } from '../component/post/post.js';
import { openDeleteModal, paintModal } from '../component/common/modal/modal.js';

const deleteHandlerMap = {
    post: (id) => deletePostHandler(id),
    comment: (id) => deleteCommentHandler(id),
};

const deletePostHandler = async (id) => {
    const res = await requestDeletePost(id);

    if (!res.success) {
        alert(res.data);
        return;
    }

    location.href = '/index';
};

const deleteCommentHandler = async (id) => {
    const res = await requestDeleteComment(id);

    if (!res.success) {
        alert(res.data);
        return;
    }

    const deletedElement = document.querySelector(`[data-commentid="${id}"]`);
    document.querySelector('.comments-container').removeChild(deletedElement);
    // document.querySelector('.post-comment-count').textContent = res.data.commentCount;

    document.querySelector('dialog').close();
};

const modalConfirmBtnClickHandler = async (target) => {
    const dialog = target.closest('dialog');
    const { domain, id } = dialog.dataset;
    deleteHandlerMap[domain](id);
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
    /* 게시글 */
    const postId = Number(window.location.pathname.split('/').at(2));
    const postRes = await requestReadPost(postId);

    if (!postRes.success) {
        document.querySelector('section').textContent = postRes.data;
        return;
    }

    paintPostReadContainer(postRes.data.post);

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

    /* 삭제 모달 */
    paintModal({
        mainText: '삭제하시겠습니까?',
        subText: '삭제한 내용은 복구할 수 없습니다',
    });

    document.querySelectorAll('.delete-btn').forEach((btn) =>
        btn.addEventListener('click', () => {
            openDeleteModal(btn.dataset.domain, btn.dataset.id);
        })
    );

    document.querySelector('.modal-confirm-btn').addEventListener('click', ({ target }) => {
        modalConfirmBtnClickHandler(target);
    });
});
