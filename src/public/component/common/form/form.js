import { requestLogin } from '../../../api/auth.js';
import { requestRegister } from '../../../api/members.js';

/* validation */
/**
 * form 노드를 매개변수로 받아 form 내 필수 입력 값이 모두 입력됐는지 확인합니다
 */
export const validateRequiredInput = (form) => {
    let isAllinput = true;

    form.querySelectorAll('.form-input').forEach((e) => {
        if (e.classList.contains('required') && !e.value) {
            e.nextElementSibling.textContent = `${e.name} 값을 입력해 주세요`;
            isAllinput = false;
        }
    });

    return isAllinput;
};

const validateEmailPattern = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidated = regex.test(email);
    return {
        isValidated,
        message: isValidated ? '' : '올바른 이메일 주소 형식을 입력하세요. (예: example@example.com)',
    };
};

const validatePasswordPattern = (password) => {
    const regex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[~.!@#$%^&*()_\-+=\[\]{}|\\;:'",?/]).{8,20}$/;
    const isValidated = regex.test(password);
    return {
        isValidated,
        message: isValidated
            ? ''
            : '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다',
    };
};

const validateConfirmedPasswordPattern = (password) => {
    const isValidated = document.querySelector('#form-password-input').value === password;
    return {
        isValidated,
        message: isValidated ? '' : password.length === 0 ? '비밀번호를 한 번 더 입력해주세요' : '비밀번호가 다릅니다',
    };
};

const valdiateNicknamePattern = (nickname) => {
    return {
        isValidated: !nickname.includes(' ') && nickname.length < 11 && nickname.length > 0,
        message: nickname.includes(' ')
            ? '띄어쓰기를 없애주세요'
            : nickname.length > 10
              ? '닉네임은 최대 10자까지 작성 가능합니다'
              : nickname.length === 0
                ? '닉네임을 입력해주세요'
                : '',
    };
};

const validatePostTitlePattern = (title) => {
    return {
        isValidated: title.length > 0 && title.length < 27,
        message:
            title.length === 0
                ? '제목을 입력해주세요'
                : title.length > 26
                  ? '제목은 최대 26글자까지 입력할 수 있습니다'
                  : '',
    };
};

const validatePostContentPattern = (content) => {
    return {
        isValidated: content.length > 0,
        message: content.length === 0 ? '내용을 입력해주세요' : '',
    };
};

const validateCommentPattern = (content) => {
    return {
        isValidated: content.length > 0 && content.length < 10000,
        message: content.length > 10000 ? '댓글은 최대 10,000글자까지 입력할 수 있습니다' : '',
    };
};

export const fieldValidationRules = {
    title: validatePostTitlePattern,
    content: validatePostContentPattern,
    email: validateEmailPattern,
    password: validatePasswordPattern,
    confirmedPassword: validateConfirmedPasswordPattern,
    nickname: valdiateNicknamePattern,
    commentContent: validateCommentPattern,
};

/* form HTML과 상호작용 */
const formSubmitMap = {
    login: {
        request: requestLogin,
        redirectionPath: '/index',
    },
    register: {
        request: requestRegister,
        redirectionPath: '/login',
    },
};

export const validateField = (name, target) => {
    const value = target.value;
    const helper = target.nextElementSibling;

    const previousIsChanged = target.dataset.ischanged === 'true';

    // 수정 여부 판단
    if (!previousIsChanged) {
        target.dataset.ischanged = true;
    }

    const result = fieldValidationRules[name](value);

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;

    return result.isValidated;
};

export const formSubmitBtnClickHandler = async (pageName) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    // 유효성 검사 통과 못하면 return
    const inputElementsWithValidated = document.querySelectorAll('[data-validated]');

    for (const e of inputElementsWithValidated) {
        if (e.dataset.validated !== 'true') return;
    }

    const formProfileImageElement = document.querySelector('.form-profile-image');
    const inputElements = document.querySelectorAll('.form-input');
    const requestBody = {};

    if (formProfileImageElement?.dataset?.ischanged === 'true') {
        requestBody.image = JSON.parse(formProfileImageElement.dataset.image);
    }

    for (const e of inputElements) {
        requestBody[e.dataset.fieldname] = e.value;
    }

    const res = await formSubmitMap[pageName].request(requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }

    location.href = formSubmitMap[pageName].redirectionPath;
};

export const ChangeFormSubmitBtnStatus = () => {
    const validatedInputElements = document.querySelectorAll('[data-validated]');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    for (const e of validatedInputElements) {
        if (e.dataset.validated !== 'true') {
            formSubmitBtn.classList.add('inactivated');
            return;
        }
    }

    formSubmitBtn.classList.remove('inactivated');
};

export const ChangeFormSubmitBtnStatus2 = (form) => {
    const validatedInputElements = form.querySelectorAll('[data-validated]');
    const formSubmitBtn = form.querySelector('.form-submit-btn');

    for (const e of validatedInputElements) {
        if (e.dataset.validated !== 'true') {
            formSubmitBtn.classList.add('inactivated');
            return;
        }
    }

    formSubmitBtn.classList.remove('inactivated');
};
