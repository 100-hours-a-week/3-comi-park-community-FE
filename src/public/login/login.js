import { validateRequiredInput, validateEmailPattern, validatePasswordPattern } from '../component/common/form/form.js';
import { requestLogin } from '../api/auth.js';

const emailKeyUpHandler = (target) => {
    const email = target.value;
    const helper = target.nextElementSibling;

    if (validateEmailPattern(email)) {
        helper.textContent = '';
        target.dataset.validated = true;
    } else {
        helper.textContent = '올바른 이메일 주소 형식을 입력하세요. (예: example@example.com)';
        target.dataset.validated = false;
    }
};

const passwordKeyUpHandler = (target) => {
    const password = target.value;
    const helper = target.nextElementSibling;

    if (validatePasswordPattern(password)) {
        helper.textContent = '';
        target.dataset.validated = 'true';
    } else {
        helper.textContent =
            '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다';
        target.dataset.validated = 'false';
    }
};

const formSubmitHandler = async () => {
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

    location.href = '/posts';
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#form-email-input').addEventListener('keyup', ({ target }) => {
        emailKeyUpHandler(target);
    });

    document.querySelector('#form-password-input').addEventListener('keyup', ({ target }) => {
        passwordKeyUpHandler(target);
    });

    document.querySelector('.form-submit-btn').addEventListener('click', formSubmitHandler);
});
