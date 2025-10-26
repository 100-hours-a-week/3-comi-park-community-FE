import { requestCancelLike, requestCreateLike } from '../api/post-like.js';
import { requestReadPost, requestDeletePost } from '../api/posts.js';
import { requestComments } from '../api/comments.js';
import {
    attachCommentEventHandler,
    paintCommentFormContainer,
    paintCommentsContainer,
} from '../component/comments/comments.js';
import { paintPostReadContainer } from '../component/post/post.js';
import { paintHeader } from '../component/common/header/header.js';
import { openModal } from '../component/common/modal/modal.js';
import { getAuth } from '../utils/auth-guard.js';

const deletePostHandler = async (id) => {
    const res = await requestDeletePost(id);

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
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    /* 게시글 */
    const postId = Number(window.location.pathname.split('/').at(2));
    const postRes = await requestReadPost(postId);

    if (!postRes.success) {
        document.querySelector('section').textContent = postRes.data;
        return;
    }

    paintPostReadContainer(postRes.data.post, loginMemberId);

    document.querySelector('.post-like-count-container').addEventListener('click', ({ currentTarget }) => {
        postLikeCountContainerClickHandler(currentTarget, postId);
    });

    /* 댓글 */
    paintCommentFormContainer();

    const commentRes = await requestComments(postId);

    if (!commentRes.success) {
        document.querySelector('.comments-container').textContent = commentRes.data;
        return;
    }

    paintCommentsContainer(commentRes.data.comments, loginMemberId);

    /* 게시글 삭제 모달 */
    const postDeleteBtnElement = document.querySelector('.delete-btn');

    if (postDeleteBtnElement) {
        postDeleteBtnElement.addEventListener('click', ({ target }) => {
            console.log(target);
            const { domain, id } = target.dataset;

            openModal({
                mainText: '게시글을 삭제하시겠습니까?',
                subText: '삭제한 내용은 복구할 수 없습니다',
                dataset: target.dataset,
                onConfirm: () => deletePostHandler(id),
            });
        });
    }

    /* 댓글 이벤트 등록 */
    attachCommentEventHandler();

    let isNewCommentFetching = false;

    window.addEventListener('scroll', async () => {
        const hitsBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

        if (!hitsBottom || isNewCommentFetching) {
            return;
        }

        isNewCommentFetching = true;

        const lastCommentId = Array.from(document.querySelectorAll('[data-commentid]')).at(-1).dataset.commentid;
        const res = await requestComments(postId, { lastCommentId });

        if (!res.success) {
            document.querySelector('.comments-container').textContent = res.data;
            return;
        }

        paintCommentsContainer(res.data.comments, loginMemberId);
        isNewCommentFetching = false;
    });
});
