import { generateFormFieldDivHtml, generateSubmitBtnDivHtml } from './form-generator.js';
import { attachFormEventHandler } from './form-event-handler.js';

/**
 * fields를 포함한 form 태그를 생성해 formParent의 자식으로 추가합니다
 * args = { formParent: element, fields: Array, values: Array, submitBtnValue: string, afterSubmit: Function}
 *
 * formParent : form 태그를 추가할 부모 Element
 * fields : Form 태그에 포함할 필드(data-keyname과 일치) 배열
 * values (optional): 수정 시 각 field의 value, 단 fields와 values는 인덱스 위치가 서로 같아야 합니다
 * submitBtnValue: 제출 버튼 value (완료, 등록, 수정, 로그인 등) !!!!
 * afterSubmit : 폼 제출 후 실행할 콜백 함수
 */
export const paintForm = (args) => {
    const formElement = document.createElement('form');
    formElement.classList.add('form');
    args.formParent.appendChild(formElement);

    const formFieldElements = [];

    // HTML에 추가
    args.fields.forEach((keyname) => {
        const formFieldDivElement = document
            .createRange()
            .createContextualFragment(
                generateFormFieldDivHtml(keyname, !!args?.values ? getValueBy(keyname, args.values) : '')
            ).firstElementChild;
        formElement.appendChild(formFieldDivElement);

        formFieldElements.push(formFieldDivElement.querySelector('.form-input'));
    });

    formElement.insertAdjacentHTML('beforeend', generateSubmitBtnDivHtml(args.submitBtnValue));

    // 이벤트 등록
    attachFormEventHandler(formElement, formFieldElements, args.afterSubmit);
};

const getValueBy = (keyname, values) => {
    if (keyname.includes('image')) {
        return values?.image;
    }

    if (keyname.includes('email')) {
        return values.email;
    }

    return values[keyname];
};
