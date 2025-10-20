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
    return regex.test(email);
};

const validatePasswordPattern = (password) => {
    const regex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[~.!@#$%^&*()_\-+=\[\]{}|\\;:'",?/]).{8,20}$/;
    return regex.test(password);
};

const validatePostTitlePattern = (title) => {
    return {
        isValidated: title.length > 0 && title.length < 27,
        message:
            title.length == 0
                ? '제목을 입력해주세요'
                : title.length > 26
                  ? '제목은 최대 26글자까지 입력할 수 있습니다'
                  : '',
    };
};

const validatePostContentPattern = (content) => {
    return {
        isValidated: content.length > 0,
        message: content.length == 0 ? '내용을 입력해주세요' : '',
    };
};

export const fieldValidationRules = {
    title: validatePostTitlePattern,
    content: validatePostContentPattern,
    email: validateEmailPattern,
    password: validatePasswordPattern,
};
