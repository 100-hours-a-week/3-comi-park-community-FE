import {
    validateRequiredInput,
    validatePostTitlePattern,
    validatePostContentPattern,
} from '../component/common/form/form.js';
import { requestWritePost } from '../api/posts.js';
import { paintPostForm } from '../component/post/post.js';

const validationRules = {
    title: {
        validateFunc: validatePostTitlePattern,
    },
    content: {
        validateFunc: validatePostContentPattern,
    },
};

const formInputKeyUpHandler = (name, target) => {
    const title = target.value;
    const helper = target.nextElementSibling;

    const previousValidated = target.dataset.validated === 'true';
    const result = validationRules[name].validateFunc(title);

    if (previousValidated == result.isValidated) {
        return;
    }

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;
};

const formSubmitBtnClickHandler = async () => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    const title = form.querySelector('#form-title-input');
    const content = form.querySelector('#form-content-input');

    if (title.dataset.validated !== 'true' || content.dataset.validated !== 'true') {
        return;
    }

    const requestBody = { title: title.value, content: content.value };
    const res = await requestWritePost(requestBody);

    if (!res.success) {
        content.nextElementSibling.textContent = '??????';
        return;
    }

    location.href = `/posts/${res.data.post.id}`;
};

document.addEventListener('DOMContentLoaded', () => {
    paintPostForm();

    const formTitleInput = document.querySelector('#form-title-input');
    const formContentInput = document.querySelector('#form-content-input');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    formTitleInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('title', target);
    });

    formContentInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('content', target);
    });

    const observer = new MutationObserver((mutationList, observer) => {
        if (formTitleInput.dataset.validated === 'true' && formContentInput.dataset.validated === 'true') {
            formSubmitBtn.classList.remove('inactivated');
        } else {
            formSubmitBtn.classList.add('inactivated');
        }
    });

    document
        .querySelectorAll('[data-validated]')
        .forEach((e) => observer.observe(e, { attributes: true, attributeFilter: ['data-validated'] }));

    formSubmitBtn.addEventListener('click', formSubmitBtnClickHandler);
});
