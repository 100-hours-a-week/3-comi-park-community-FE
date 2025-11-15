import { paintForm } from '../component/common/form/form-painter.js';
import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { requestLogin } from '../apis/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    const sectionElement = mainElement.querySelector('section');
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

            location.replace('/');
        },
    });

    sectionElement.querySelector('.form').insertAdjacentHTML(
        'beforeend',
        `<div>
            <button class="btn form-sub-btn" type="button" onclick="location.href='/register'">회원가입</button>
        </div>`
    );

    paintFooter(bodyElement, mainElement);
});
