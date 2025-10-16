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

export const validateEmailPattern = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

export const validatePasswordPattern = (password) => {
    const regex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[~.!@#$%^&*()_\-+=\[\]{}|\\;:'",?/]).{8,20}$/;
    return regex.test(password);
};
