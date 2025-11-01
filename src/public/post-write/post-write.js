import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { paintForm } from '../component/common/form/form-painter.js';
import { getAuth } from '../utils/auth-guard.js';
import { requestWritePost } from '../api/posts.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    const sectionElement = document.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">게시글 작성</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['title', 'content', 'post-image'],
        submitBtnValue: '등록',
        afterSubmit: async (requestBody) => {
            const res = await requestWritePost(requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            location.replace(`/read/${res.data.post.id}`);
        },
    });

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    paintFooter(bodyElement, mainElement);
});
