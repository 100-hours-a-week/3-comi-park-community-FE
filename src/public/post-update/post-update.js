import { paintForm } from '../component/common/form/form-painter.js';
import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { requestUpdatePost } from '../api/posts.js';
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

    paintHeader(success, loginMemberId);

    const sectionElement = document.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">게시글 수정</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['title', 'content', 'post-image'],
        values: res.data.post,
        submitBtnValue: '수정',
        afterSubmit: async (requestBody) => {
            const res = await requestUpdatePost(postId, requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            location.replace(`/read/${postId}`);
        },
    });

    paintFooter(sectionElement);
});
