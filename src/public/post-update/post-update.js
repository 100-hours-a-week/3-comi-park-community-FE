import {
    validateRequiredInput,
    validatePostTitlePattern,
    validatePostContentPattern,
} from '../component/common/form/form.js';
import { requestReadPost, requestUpdatePost } from '../api/posts.js';
import { paintPostForm } from '../component/post/post.js';

const validationRules = {
    title: {
        validateFunc: validatePostTitlePattern,
    },
    content: {
        validateFunc: validatePostContentPattern,
    },
};

const ChangeFormSubmitBtnStatus = () => {
    const formTitleInput = document.querySelector('#form-title-input');
    const formContentInput = document.querySelector('#form-content-input');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    if (formTitleInput.dataset.validated === 'true' && formContentInput.dataset.validated === 'true') {
        formSubmitBtn.classList.remove('inactivated');
    } else {
        formSubmitBtn.classList.add('inactivated');
    }
};

const formInputKeyUpHandler = (name, target) => {
    const title = target.value;
    const helper = target.nextElementSibling;

    const previousIsChanged = target.dataset.ischanged === 'true';

    // 수정 여부 판단
    if (!previousIsChanged) {
        target.dataset.ischanged = true;
    }

    const previousValidated = target.dataset.validated === 'true';
    const result = validationRules[name].validateFunc(title);

    if (previousValidated == result.isValidated) {
        return;
    }

    target.dataset.validated = result.isValidated;
    helper.textContent = result.message;

    ChangeFormSubmitBtnStatus();
};

const formSubmitBtnClickHandler = async (postId) => {
    const form = document.querySelector('.form');

    if (!validateRequiredInput(form)) {
        return;
    }

    const title = form.querySelector('#form-title-input');
    const content = form.querySelector('#form-content-input');

    if (title.dataset.validated !== 'true' || content.dataset.validated !== 'true') {
        return;
    }

    const requestBody = {};

    if (title.dataset.ischanged === 'true') {
        requestBody.title = title.value;
    }

    if (content.dataset.ischanged === 'true') {
        requestBody.content = content.value;
    }

    const res = await requestUpdatePost(postId, requestBody);

    if (!res.success) {
        content.nextElementSibling.textContent = res.data;
        return;
    }

    location.href = `/read/${postId}`;
};

document.addEventListener('DOMContentLoaded', async () => {
    const postId = Number(window.location.pathname.split('/').at(2));
    const res = await requestReadPost(postId);

    if (!res.success) {
        document.querySelector('section').textContent = res.data;
        return;
    }

    paintPostForm(res.data.post);

    const formTitleInput = document.querySelector('#form-title-input');
    const formContentInput = document.querySelector('#form-content-input');
    const formSubmitBtn = document.querySelector('.form-submit-btn');

    formTitleInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('title', target);
    });

    formContentInput.addEventListener('keyup', ({ target }) => {
        formInputKeyUpHandler('content', target);
    });

    formSubmitBtn.addEventListener('click', () => {
        formSubmitBtnClickHandler(postId);
    });
});
