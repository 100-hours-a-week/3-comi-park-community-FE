import { validateField, formSubmitBtnClickHandler } from '../component/common/form/form.js';
import { debouncedRequest } from '../utils/debounce-helper.js';
import { paintHeader } from '../component/common/header/header.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();

    document.querySelectorAll('.form-input').forEach((e) => {
        e.addEventListener(
            'input',
            debouncedRequest(function ({ target }) {
                const fieldName = target.dataset.fieldname;
                validateField(fieldName, target);
            }, 400)
        );
    });

    debouncedRequest();

    document.querySelector('.form-submit-btn').addEventListener('click', () => formSubmitBtnClickHandler('login'));
});
