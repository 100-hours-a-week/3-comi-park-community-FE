import { validateRequiredInput, validateField, ChangeFormSubmitBtnStatus } from '../component/common/form/form.js';
import {
    requestMemberInfo,
    requestMemberInfoUpdate,
    requestNicknameDuplicationCheck,
    requestMemberDelete,
} from '../api/members.js';
import { paintHeader } from '../component/common/header/header.js';
import { debouncedRequest } from '../utils/debounce-helper.js';
import { API_SERVER_URI } from '../utils/constants.js';
import { openModal } from '../component/common/modal/modal.js';
import { requestMemberImageUpload } from '../api/images.js';
import { getAuth } from '../utils/auth-guard.js';

const requestMap = {
    nickname: requestNicknameDuplicationCheck,
};

const inputFormInputHandlerDebounced = (inputElement, originalValue) => {
    inputElement.addEventListener(
        'input',
        debouncedRequest(async function ({ target }) {
            const isUnique = target.dataset.unique === 'true';
            const fieldName = target.dataset.fieldname;
            const fieldValue = target.value;

            if (fieldValue === originalValue) {
                target.nextElementSibling.textContent = '기존 닉네임과 동일합니다';
                target.dataset.validated = false;
                ChangeFormSubmitBtnStatus();
                return;
            }

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

export const formSubmitBtnClickHandler = async (target, memberId) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    // 유효성 검사 통과 못하면 return
    const inputElementsWithValidated = document.querySelectorAll('[data-validated]');

    for (const e of inputElementsWithValidated) {
        if (e.dataset.validated !== 'true') return;
    }

    const inputElements = document.querySelectorAll('.form-input');

    const formProfileImageElement = document.querySelector('.form-profile-image');
    const requestBody = {};

    if (formProfileImageElement.dataset.ischanged === 'true') {
        requestBody.image = JSON.parse(formProfileImageElement.dataset.image);
    }

    for (const e of inputElements) {
        requestBody[e.dataset.fieldname] = e.value;
    }

    const res = await requestMemberInfoUpdate(memberId, requestBody);

    if (!res.success) {
        inputElements[0].nextElementSibling.textContent = res.data;
        return;
    }

    inputElements[0].nextElementSibling.textContent = '수정 완료';

    // 수정이 완료됐으므로 초기화
    document.querySelectorAll('[data-ischanged]').forEach((e) => (e.dataset.ischanged = false));
    target.classList.add('inactivated');
};

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);

    const nicknameInput = document.querySelector('#form-nickname-input');
    const emailInput = document.querySelector('#form-email-input');

    const res = await requestMemberInfo(loginMemberId);

    if (!res.success) {
        nicknameInput.nextElementSibling.textContent = res.data;
        emailInput.nextElementSibling.textContent = res.data;
    }

    emailInput.value = res.data.member.email;
    nicknameInput.value = res.data.member.nickname;
    inputFormInputHandlerDebounced(nicknameInput, res.data.member.nickname);
    document
        .querySelector('.form-submit-btn')
        .addEventListener('click', ({ target }) => formSubmitBtnClickHandler(target, loginMemberId));

    /* 삭제 모달 */
    document.querySelectorAll('.withdraw-btn').forEach((btn) =>
        btn.addEventListener('click', () => {
            openModal({
                mainText: `회원 탈퇴하시겠습니까?`,
                subText: '작성된 게시글과 댓글은 삭제됩니다',
                dataset: { domain: 'member', id: loginMemberId },
                onConfirm: async () => {
                    const res = await requestMemberDelete(loginMemberId);

                    if (!res.success) {
                        alert(res.data);
                        return;
                    }

                    location.href = '/login';
                },
            });
        })
    );

    /* 이미지 처리 */
    const formProfileImageElement = document.querySelector('.form-profile-image');
    const imageSrc = !!res.data.member.image
        ? `${API_SERVER_URI}/s3/${res.data.member.image.objectKey}`
        : '/assets/default-profile-image.png';
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
