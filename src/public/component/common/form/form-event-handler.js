import { debouncedRequest } from '../../../utils/debounce-helper.js';
import { fieldValidationRules } from '../../../utils/validate-helper.js';
import { requestImageUpload } from '../../../api/images.js';
import { DEFAULT_MEMBER_IMAGE } from '../../../utils/constants.js';

export const attachFormEventHandler = (formElement, fieldElements, afterSubmit) => {
    const submitBtnElement = formElement.querySelector('.form-submit-btn');
    const filedElementsWithValidated = fieldElements.filter((element) => Object.hasOwn(element.dataset, 'validated'));

    // 이미지 처리
    formImageElementHandler(formElement, submitBtnElement, filedElementsWithValidated);

    // 입력 값 검증 및 버튼 상태 변경 이벤트
    formFieldInputHandler(submitBtnElement, filedElementsWithValidated);

    // 제출 버튼 클릭 이벤트
    formSubmitBtnClickHandler(submitBtnElement, fieldElements, afterSubmit);
};

const formImageElementHandler = (formElement, submitBtnElement, filedElementsWithValidated) => {
    const formImageUpdateBtnClickHandler = () => {
        imageUpdateBtnElement.addEventListener('click', () => {
            imageInputElement.click();
        });
    };

    const formImageDeleteBtnClickHandler = () => {
        imageDeleteBtnElement.addEventListener('click', () => {
            if (imageInputElement.dataset.value === 'null') {
                // 등록된 이미지가 없다면 삭제 버튼 클릭해도 아무 처리 X
                return;
            }

            imageInputElement.dataset.value = null;
            imageInputElement.dataset.ischanged = true;

            imageMap[keyname].onDeleteBtnClick(imageMap[keyname].element);

            changeFormSubmitBtnStatus(submitBtnElement, filedElementsWithValidated);
        });
    };

    const formImageInputElementChangeHandler = () => {
        imageInputElement.addEventListener('change', async ({ target }) => {
            const file = target.files[0];

            if (!file) {
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const res = await requestImageUpload(imageMap[keyname].domain, formData);

            if (!res.success) {
                console.error(res.data);
            } else {
                imageInputElement.dataset.ischanged = true;
                imageInputElement.dataset.value = JSON.stringify({
                    id: res.data.image.id,
                    objectKey: res.data.image.objectKey,
                });

                imageMap[keyname].afterUpload(res, imageMap[keyname].element);
            }
        });
    };

    const imageUpdateBtnElement = formElement.querySelector('.form-image-update-btn');
    const imageDeleteBtnElement = formElement.querySelector('.form-image-delete-btn');
    const imageInputElement = formElement.querySelector('#form-image-input');

    const keyname = imageInputElement.dataset.keyname;

    const imageMap = {
        'post-image': {
            domain: 'posts',
            element: formElement.querySelector('.form-post-image'),
            onDeleteBtnClick: (element) => {
                element.value = '등록된 이미지가 없습니다';
            },
            afterUpload: (res, element) => {
                element.value = res.data.image.filename;
            },
        },
        'member-image': {
            domain: 'members',
            element: formElement.querySelector('.form-member-image'),
            onDeleteBtnClick: (element) => {
                element.src = DEFAULT_MEMBER_IMAGE;
            },
            afterUpload: (res, element) => {
                element.src = res.data.image.url;
            },
        },
    };

    formImageUpdateBtnClickHandler();
    formImageDeleteBtnClickHandler();
    formImageInputElementChangeHandler();
};

const formFieldInputHandler = (submitBtnElement, filedElementsWithValidated) => {
    filedElementsWithValidated.forEach((fieldElement) =>
        fieldElement.addEventListener(
            'input',
            debouncedRequest(async function () {
                const { ischanged, keyname, isunique } = fieldElement.dataset;
                const value = fieldElement.value;
                const formHelperTextElement = fieldElement.nextElementSibling;

                if (ischanged === 'false') {
                    fieldElement.dataset.ischanged = true;
                }

                const { isValidated, message } = fieldValidationRules[keyname](value);

                // TODO: isunique가 true인 필드에 대한 중복 체크 API

                fieldElement.dataset.validated = isValidated;
                formHelperTextElement.textContent = message;

                changeFormSubmitBtnStatus(submitBtnElement, filedElementsWithValidated);
            })
        )
    );
};

const changeFormSubmitBtnStatus = (submitBtnElement, filedElementsWithValidated) => {
    const hasInvalidated = filedElementsWithValidated.some((element) => element.dataset.validated !== 'true');

    if (hasInvalidated) {
        submitBtnElement.classList.add('inactivated');
        submitBtnElement.disabled = true;
    } else {
        submitBtnElement.classList.remove('inactivated');
        submitBtnElement.disabled = false;
    }
};

const formSubmitBtnClickHandler = (submitBtnElement, fieldElements, onSubmit) => {
    submitBtnElement.addEventListener('click', async () => {
        // 필수 입력 필드 값 유무 확인
        const requiredFieldElementsWithEmptyValue = fieldElements.filter(
            (element) => element.classList.contains('required') && !element.value
        );

        if (requiredFieldElementsWithEmptyValue.length > 0) {
            requiredFieldElementsWithEmptyValue.forEach(
                (element) => (element.nextElementSibling.textContent = `${element.name} 값을 입력해 주세요`)
            );

            return;
        }

        const requestBody = createRequestBody(fieldElements);
        await onSubmit(requestBody);
    });
};

const createRequestBody = (fieldElements) => {
    return fieldElements.reduce((requestBody, element) => {
        if (element.dataset.ischanged === 'true') {
            requestBody[element.dataset.fieldname] =
                element.type === 'file' ? JSON.parse(element.dataset.value) : element.value;
        }

        return requestBody;
    }, {});
};
