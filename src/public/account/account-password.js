import { validateRequiredInput, validateField, ChangeFormSubmitBtnStatus } from '../component/common/form/form.js';
import { requestMemberInfoUpdate } from '../api/members.js';
import { debouncedRequest } from '../utils/debounce-helper.js';
import { getAuth } from '../utils/auth-guard.js';

const inputFormInputHandlerDebounced = (inputElement) => {
    inputElement.addEventListener(
        'input',
        debouncedRequest(async function ({ target }) {
            const fieldName = target.dataset.fieldname;
            validateField(fieldName, target);
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
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    document.querySelectorAll('.form-input').forEach((e) => inputFormInputHandlerDebounced(e));
    document
        .querySelector('.form-submit-btn')
        .addEventListener('click', () => formSubmitBtnClickHandler(loginMemberId));
});
