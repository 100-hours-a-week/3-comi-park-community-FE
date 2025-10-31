import { paintForm } from '../component/common/form/form-painter.js';
import { paintHeader } from '../component/common/header/header.js';
import { requestMemberInfoUpdate } from '../api/members.js';
import { getAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    const sectionElement = document.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">비밀번호 수정</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['password', 'confirmed-password'],
        submitBtnValue: '수정',
        afterSubmit: async (requestBody) => {
            const res = await requestMemberInfoUpdate(loginMemberId, requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            // TODO: 오른쪽 상단에 토스 메시지 띄우기
            alert('비밀번호가 수정됐습니다');

            // 수정 완료됐으므로 input 초기화
            sectionElement.querySelectorAll('[data-ischanged]').forEach((e) => {
                e.dataset.ischanged = false;
                e.dataset.value = '';
            });
            const submitBtnElement = sectionElement.querySelector('.form-submit-btn');
            submitBtnElement.classList.add('inactivated');
            submitBtnElement.disabled = true;
        },
    });
});
