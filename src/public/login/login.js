import { validateRequiredInput, fieldValidationRules } from '../component/common/form/form.js';
import { requestLogin } from '../api/auth.js';

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

    const email = form.querySelector('#form-email-input');
    const password = form.querySelector('#form-password-input');

    if (email.dataset.validated !== 'true' || password.dataset.validated !== 'true') {
        return;
    }

    const res = await requestLogin(email.value, password.value);

    if (!res.success) {
        password.nextElementSibling.textContent = '아이디 또는 비밀번호를 확인해주세요';
        return;
    }

    location.href = '/index';
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#form-email-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('email', target);
    });

    document.querySelector('#form-password-input').addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('password', target);
    });

    document.querySelector('.form-submit-btn').addEventListener('click', formSubmitBtnClickHandler);
});
