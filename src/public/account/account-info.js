import { requestMemberInfo, requestMemberInfoUpdate, requestMemberDelete } from '../apis/members.js';
import { paintForm } from '../component/common/form/form-painter.js';
import { destroyCookie, setCookie } from '../utils/cookie-helper.js';
import { paintHeader } from '../component/common/header/header.js';
import { paintFooter } from '../component/common/footer/footer.js';
import { openModal } from '../component/common/modal/modal.js';
import { DEFAULT_MEMBER_IMAGE } from '../utils/constants.js';
import { getAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    const res = await requestMemberInfo(loginMemberId);

    if (!res.success) {
        document.querySelector('section').textContent = res.data;
        return;
    }

    paintHeader(success, loginMemberId);

    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    const sectionElement = mainElement.querySelector('section');
    sectionElement.insertAdjacentHTML('beforeend', `<div class="title">회원정보수정</div>`);

    paintForm({
        formParent: sectionElement,
        fields: ['member-image', 'disabled-email', 'nickname'],
        values: res.data.member,
        submitBtnValue: '수정',
        afterSubmit: async (requestBody) => {
            const res = await requestMemberInfoUpdate(loginMemberId, requestBody);

            if (!res.success) {
                // TODO: 오른쪽 상단에 토스 메시지 띄우기
                alert(res.data);
                return;
            }

            // TODO: 오른쪽 상단에 토스 메시지 띄우기
            alert('회원 정보가 수정됐습니다');

            if (Object.hasOwn(res.data, 'image')) {
                setCookie('loginMemberImageUrl', res.data.image?.url ?? DEFAULT_MEMBER_IMAGE);
            }

            // 수정 완료됐으므로 input 초기화
            sectionElement.querySelectorAll('[data-ischanged]').forEach((e) => (e.dataset.ischanged = false));
            const submitBtnElement = sectionElement.querySelector('.form-submit-btn');
            submitBtnElement.classList.add('inactivated');
            submitBtnElement.disabled = true;
        },
    });

    const formElement = sectionElement.querySelector('.form');
    formElement.insertAdjacentHTML(
        'beforeend',
        `<div class="">
            <button class="btn form-sub-btn withdraw-btn" type="button" data-domain="member" data-id="">회원 탈퇴</button>
        </div>`
    );

    paintFooter(bodyElement, mainElement);

    /* 삭제 모달 */
    formElement.querySelector('.withdraw-btn').addEventListener('click', () => {
        openModal({
            mainText: `회원 탈퇴하시겠습니까?`,
            subText: '작성된 게시글과 댓글은 삭제됩니다',
            dataset: { domain: 'member', id: loginMemberId },
            onConfirm: async () => {
                const res = await requestMemberDelete(loginMemberId);

                if (!res.success) {
                    alert(res.data);
                    return;
                }

                destroyCookie('loginMemberImageUrl');
                location.replace('/login');
            },
        });
    });
});
