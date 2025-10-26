import { generateFormFieldDivHtml, generateSubmitBtnDivHtml } from './form-generator.js';

/**
 * fields를 포함한 form 태그를 생성해 formParent의 자식으로 추가합니다
 *
 * @param {*} formParent : form 태그를 추가할 부모 Element
 * @param {*} fields : Form 태그에 포함할 필드(data-keyname과 일치) 배열
 */
export const paintForm = (formParent, fields) => {
    const formElement = document.createElement('form');
    formElement.classList.add('form');
    formParent.appendChild(formElement);

    const formFieldElements = {};

    // HTML에 추가
    fields.forEach((keyname) => {
        const formFieldDivElement = document
            .createRange()
            .createContextualFragment(generateFormFieldDivHtml(keyname)).firstElementChild;

        formElement.appendChild(formFieldDivElement);
        formFieldElements[keyname] = formFieldDivElement.querySelector('.form-input');
    });

    formElement.insertAdjacentHTML('beforeend', generateSubmitBtnDivHtml('완료'));
};
