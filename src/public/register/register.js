import { validateRequiredInput, fieldValidationRules } from '../component/common/form/form.js';
import { requestRegister } from '../api/members.js';

const formInputKeyUpHandler = (name, target) => {
    const value = target.value;
    const helper = target.nextElementSibling;

    const result = fieldValidationRules[name](value);

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;
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
        console.log(res);
        document.querySelector('#form-nickname-input').nextElementSibling.textContent = res.data;
        return;
    }

    location.href = '/login';
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#form-email-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('email', target);
    });

    document.querySelector('#form-password-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('password', target);
    });

    document.querySelector('#form-confirmed-password-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('confirmedPassword', target);
    });

    document.querySelector('#form-nickname-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('nickname', target);
    });

    document.querySelector('.form-submit-btn').addEventListener('click', formSubmitBtnClickHandler);
});
