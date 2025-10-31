import { paintForm } from '../component/common/form/form-painter.js';
import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { requestLogin } from '../api/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();

    const sectionElement = document.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">로그인</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['email', 'password'],
        submitBtnValue: '로그인',
        afterSubmit: async (requestBody) => {
            const res = await requestLogin(requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            location.replace('/index');
        },
    });

    sectionElement.insertAdjacentHTML(
        'beforeend',
        `<div>
            <button class="btn" type="button"><a href="/register">회원가입</a></button>
        </div>`
    );

    paintFooter(sectionElement);
});
