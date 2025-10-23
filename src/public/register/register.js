import { validateField, formSubmitBtnClickHandler, ChangeFormSubmitBtnStatus } from '../component/common/form/form.js';
import { requestEmailDuplicationCheck, requestNicknameDuplicationCheck } from '../api/members.js';
import { debouncedRequest } from '../utils/debounce-helper.js';
import { requestMemberImageUpload } from '../api/images.js';
import { API_SERVER_URI } from '../utils/constants.js';

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

    const formProfileImageElement = document.querySelector('.form-profile-image');
    const imageSrc = '/assets/default-profile-image.png';
    formProfileImageElement.src = imageSrc;

    document.querySelector('.form-profile-image-container').addEventListener('click', (target) => {
        if (target.target === document.querySelector('.form-image-delete-btn')) {
            return;
        }
        document.querySelector('.form-profile-image-hidden').click();
    });

    document.querySelector('.form-image-delete-btn').addEventListener('click', ({ target }) => {
        document.querySelector('.form-profile-image-hidden').value = '';
        formProfileImageElement.src = '/assets/default-profile-image.png';
        formProfileImageElement.dataset.ischanged = true;
        formProfileImageElement.dataset.image = null;

        ChangeFormSubmitBtnStatus();
    });

    document.querySelector('.form-profile-image-hidden').addEventListener('change', async ({ target }) => {
        const file = target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await requestMemberImageUpload(formData);

        if (!res.success) {
            target.nextElementSibling.textContent = res.data;
        } else {
            target.nextElementSibling.textContent = '업로드 ';
            formProfileImageElement.src = `${API_SERVER_URI}/s3/${res.data.image.objectKey}`;
            formProfileImageElement.dataset.ischanged = true;
            formProfileImageElement.dataset.image = JSON.stringify({
                id: res.data.image.id,
                objectKey: res.data.image.objectKey,
            });

            ChangeFormSubmitBtnStatus();
        }
    });
});
