import { paintForm } from '/component/common/form/form-painter.js';
import { paintHeader } from '/component/common/header/header.js';
import { paintFooter } from '/component/common/footer/footer.js';
import { requestRegister } from '/apis/members.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    const sectionElement = mainElement.querySelector('section');

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

            location.replace('/login/index.html');
        },
    });

    sectionElement.querySelector('.form').insertAdjacentHTML(
        'beforeend',
        `<div>
            <button class="btn form-sub-btn" type="button" onclick="location.href='/login/index.html'">로그인</button>
        </div>`
    );

    paintFooter(bodyElement, mainElement);
});
