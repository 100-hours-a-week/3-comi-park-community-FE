import { validateField, formSubmitBtnClickHandler, ChangeFormSubmitBtnStatus } from '../component/common/form/form.js';
import { requestEmailDuplicationCheck, requestNicknameDuplicationCheck } from '../api/members.js';
import { debouncedRequest } from '../utils/debounce-helper.js';

const requestMap = {
    email: requestEmailDuplicationCheck,
    nickname: requestNicknameDuplicationCheck,
};

const inputFormInputHandlerDebounced = (inputElement) => {
    inputElement.addEventListener(
        'input',
        debouncedRequest(async function ({ target }) {
            const isUnique = target.dataset.unique === 'true';
            const fieldName = target.dataset.fieldname;
            const fieldValue = target.value;

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-input').forEach((e) => inputFormInputHandlerDebounced(e));
    document.querySelector('.form-submit-btn').addEventListener('click', () => formSubmitBtnClickHandler('register'));
});
