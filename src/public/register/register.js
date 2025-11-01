import { paintForm } from '../component/common/form/form-painter.js';
import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { requestRegister } from '../api/members.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();

    const sectionElement = document.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">회원가입</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['member-image', 'unique-email', 'password', 'confirmed-password', 'nickname'],
        submitBtnValue: '회원가입',
        afterSubmit: async (requestBody) => {
            const res = await requestRegister(requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            location.replace('/login');
        },
    });

    sectionElement.insertAdjacentHTML(
        'beforeend',
        `<div>
                <button class="btn" type="button"><a href="/login">로그인</a></button>
            </div>`
    );

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    paintFooter(bodyElement, mainElement);
});
