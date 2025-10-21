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

export const fieldValidationRules = {
    title: validatePostTitlePattern,
    content: validatePostContentPattern,
    email: validateEmailPattern,
    password: validatePasswordPattern,
    confirmedPassword: validateConfirmedPasswordPattern,
    nickname: valdiateNicknamePattern,
};
