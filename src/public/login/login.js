import { validateField, formSubmitBtnClickHandler } from '../component/common/form/form.js';
import { debouncedRequest } from '../utils/debounce-helper.js';

document.addEventListener('DOMContentLoaded', () => {
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
