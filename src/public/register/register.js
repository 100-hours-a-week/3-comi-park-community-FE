import { validateRequiredInput, fieldValidationRules } from '../component/common/form/form.js';
import { requestEmailDuplicationCheck, requestNicknameDuplicationCheck, requestRegister } from '../api/members.js';

const requestMap = {
    email: requestEmailDuplicationCheck,
    nickname: requestNicknameDuplicationCheck,
};

const formSubmitBtnClickHandler = async () => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    // 유효성 검사 통과 못하면 return
    const inputElements = document.querySelectorAll('[data-validated]');
    for (const e of inputElements) {
        if (e.dataset.validated !== 'true') return;
    }

    const requestBody = {};
    for (const e of inputElements) {
        requestBody[e.dataset.fieldname] = e.value;
    }

    const res = await requestRegister(requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }

    location.href = '/login';
};

function debouncedRequest(fn, delay = 200) {
    let timer;
    return function () {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const formInputKeyUpHandler = (name, target) => {
    const value = target.value;
    const helper = target.nextElementSibling;

    const result = fieldValidationRules[name](value);

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;

    return result.isValidated;
};

const inputFormInputHandlerDebounced = (inputElement) => {
    inputElement.addEventListener(
        'input',
        debouncedRequest(async function ({ target }) {
            const isUnique = target.dataset.unique === 'true';
            const fieldName = target.dataset.fieldname;
            const fieldValue = target.value;

            if (!formInputKeyUpHandler(fieldName, target)) {
                // 유효한 값이 아니라면 중복 체크 요청을 보내지 않음
                return;
            }

            if (!isUnique) {
                // 중복 체크 요청 필요 없음
                return;
            }

            const res = await requestMap[fieldName](fieldValue);

            if (!res.success) {
                target.nextElementSibling.textContent = res.data;
            }
        }, 400)
    );
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-input').forEach((e) => inputFormInputHandlerDebounced(e));
    document.querySelector('.form-submit-btn').addEventListener('click', formSubmitBtnClickHandler);
});
