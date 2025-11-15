import { requestCancelLike, requestCreateLike } from '/apis/post-like.js';
import { requestComments, requestWriteComment } from '/apis/comments.js';
import { requestReadPost, requestDeletePost } from '/apis/posts.js';
import { paintForm } from '/component/common/form/form-painter.js';
import { paintPostReadContainer } from '/component/post/post.js';
import { paintHeader } from '/component/common/header/header.js';
import { paintFooter } from '/component/common/footer/footer.js';
import { openModal } from '/component/common/modal/modal.js';
import { getQueryParams } from '/utils/query-helper.js';
import { getAuth } from '/utils/auth-guard.js';
import {
    paintCommentsContainer,
    generateCommentContainerHtml,
    attachCommentUpdateFormEventHandler,
} from '/component/comments/comments.js';

const deletePostHandler = async (id) => {
    const res = await requestDeletePost(id);

    if (!res.success) {
        alert(res.data);
        return;
    }

    location.replace('/index.html');
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
    target.firstElementChild.textContent = res.data.count;
};

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    /* 게시글 */
    const params = getQueryParams();
    const postId = Number(params.id);
    const postRes = await requestReadPost(postId);

    if (!postRes.success) {
        document.querySelector('section').textContent = postRes.data;
        return;
    }

    // 게시글 표시
    paintPostReadContainer(postRes.data, loginMemberId);

    document.querySelector('.post-like-count-container').addEventListener('click', ({ currentTarget }) => {
        postLikeCountContainerClickHandler(currentTarget, postId);
    });

    // 게시글 삭제 이벤트 등록
    const postDeleteBtnElement = document.querySelector('.delete-btn');

    if (postDeleteBtnElement) {
        postDeleteBtnElement.addEventListener('click', ({ target }) => {
            const { domain, id } = target.dataset;

            openModal({
                mainText: '게시글을 삭제하시겠습니까?',
                subText: '삭제한 내용은 복구할 수 없습니다',
                dataset: target.dataset,
                onConfirm: () => deletePostHandler(id),
            });
        });
    }

    /* 댓글 */
    const postCommentCountElement = document.querySelector('.post-comment-count');
    const commentFormContainerElement = document.querySelector('.comment-form-container');
    const commentsContainerElement = document.querySelector('.comments-container');

    // 댓글 입력 폼
    paintForm({
        formParent: commentFormContainerElement,
        fields: ['comment'],
        submitBtnValue: '등록',
        afterSubmit: async (requestBody) => {
            const res = await requestWriteComment(requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            // 수정 완료됐으므로 input 초기화
            const commentInputElement = commentFormContainerElement.querySelector('#form-comment-input');
            commentInputElement.dataset.ischanged = false;
            commentInputElement.value = '';
            const submitBtnElement = commentFormContainerElement.querySelector('.form-submit-btn');
            submitBtnElement.classList.add('inactivated');
            submitBtnElement.disabled = true;

            // 댓글 표시
            postCommentCountElement.textContent = res.data.count;
            commentsContainerElement.insertAdjacentHTML(
                'afterbegin',
                generateCommentContainerHtml(res.data.comment, res.data.comment.member.id)
            );
        },
    });

    // 댓글 표시
    const commentRes = await requestComments(postId);

    if (!commentRes.success) {
        commentsContainerElement.textContent = commentRes.data;
        return;
    }

    paintCommentsContainer(commentRes.data.comments, loginMemberId);

    // 이벤트 등록
    attachCommentUpdateFormEventHandler(commentsContainerElement, postCommentCountElement);

    // 댓글 무한 스크롤링
    let isFetching = false;
    let hasNext = commentRes.data.hasNext;
    const commentElements = Array.from(commentsContainerElement.querySelectorAll('[data-commentid]'));
    let lastCommentId = commentElements.length > 0 ? commentElements.at(-1).dataset.commentid : -1;

    window.addEventListener('scroll', async () => {
        if (!hasNext) return;

        const hitsBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

        if (!hitsBottom || isFetching) {
            return;
        }
        isFetching = true;
        const res = await requestComments(postId, { lastCommentId });

        if (!res.success) {
            document.querySelector('.comments-container').textContent = res.data;
            return;
        }

        hasNext = res.data.hasNext;
        lastCommentId = res.data.comments.at(-1).id;

        paintCommentsContainer(res.data.comments, loginMemberId);
        isFetching = false;
    });

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    paintFooter(bodyElement, mainElement);
    isFetching = false;
});
