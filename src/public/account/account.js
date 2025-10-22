import { validateRequiredInput, validateField, ChangeFormSubmitBtnStatus } from '../component/common/form/form.js';
import { requestMemberInfo, requestMemberInfoUpdate, requestNicknameDuplicationCheck } from '../api/members.js';
import { debouncedRequest } from '../utils/debounce-helper.js';
import { getCookie } from '../utils/cookie-helper.js';

const requestMap = {
    nickname: requestNicknameDuplicationCheck,
};

const inputFormInputHandlerDebounced = (inputElement, originalValue) => {
    inputElement.addEventListener(
        'input',
        debouncedRequest(async function ({ target }) {
            const isUnique = target.dataset.unique === 'true';
            const fieldName = target.dataset.fieldname;
            const fieldValue = target.value;

            if (fieldValue === originalValue) {
                target.nextElementSibling.textContent = '기존 닉네임과 동일합니다';
                target.dataset.validated = false;
                ChangeFormSubmitBtnStatus();
                return;
            }

            if (validateField(fieldName, target) && isUnique) {
                // 유효한 값이면서 중복 체크 요청이 필요한 경우에만 백엔드 서버로 request 요청
                const res = await requestMap[fieldName](fieldValue);

                if (!res.success) {
                    target.nextElementSibling.textContent = res.data;
                    target.dataset.validated = false;
                }
            }

            ChangeFormSubmitBtnStatus();
        }, 400)
    );
};

export const formSubmitBtnClickHandler = async (memberId) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    // 유효성 검사 통과 못하면 return
    const inputElementsWithValidated = document.querySelectorAll('[data-validated]');

    for (const e of inputElementsWithValidated) {
        if (e.dataset.validated !== 'true') return;
    }

    const inputElements = document.querySelectorAll('.form-input');
    const requestBody = {};

    for (const e of inputElements) {
        requestBody[e.dataset.fieldname] = e.value;
    }

    const res = await requestMemberInfoUpdate(memberId, requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }
    inputElements[0].nextElementSibling.textContent = '수정 완료';
};

document.addEventListener('DOMContentLoaded', async () => {
    const nicknameInput = document.querySelector('#form-nickname-input');
    const loginMemberId = getCookie('loginMember');

    const res = await requestMemberInfo(loginMemberId);

    if (!res.success) {
        nicknameInput.nextElementSibling.textContent = res.data;
    }

    nicknameInput.value = res.data.member.nickname;
    inputFormInputHandlerDebounced(nicknameInput, res.data.member.nickname);
    document
        .querySelector('.form-submit-btn')
        .addEventListener('click', () => formSubmitBtnClickHandler(loginMemberId));
});
