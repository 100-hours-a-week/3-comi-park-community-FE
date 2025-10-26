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

const validateConfirmedPasswordPattern = (password, confirmedPassword) => {
    const isValidated = password === confirmedPassword;
    return {
        isValidated,
        message: isValidated
            ? ''
            : confirmedPassword.length === 0
              ? '비밀번호를 한 번 더 입력해주세요'
              : '비밀번호가 다릅니다',
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

const validateTitlePattern = (title) => {
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

const validateContentPattern = (content) => {
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

/**
 * key는 input 태그의 data-keyname과 일치해야 합니다
 */
export const fieldValidationRules = {
    title: validateTitlePattern,
    content: validateContentPattern,
    email: validateEmailPattern,
    password: validatePasswordPattern,
    confirmedPassword: validateConfirmedPasswordPattern,
    nickname: valdiateNicknamePattern,
    comment: validateCommentPattern,
};
