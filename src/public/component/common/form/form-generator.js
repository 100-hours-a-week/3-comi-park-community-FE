import { DEFAULT_MEMBER_IMAGE } from '/utils/constants.js';

const defaultFieldAttributes = {
    /* members */
    email: {
        // 로그인 시 형식 검증만 진행
        name: '이메일',
        type: 'email',
        fieldname: 'email',
        keyname: 'email',
        isRequired: true,
        isUnique: false,
    },
    'unique-email': {
        // 회원가입 시 형식 검증과 중복 체크 진행
        name: '이메일',
        type: 'email',
        fieldname: 'email',
        keyname: 'email',
        isRequired: true,
        isUnique: true,
    },
    'disabled-email': {
        // 회원정보 수정 시 이메일 표시만 함
        name: '이메일',
        type: 'email',
        fieldname: 'email',
        keyname: 'email',
        isRequired: true,
        isUnique: true,
        disabled: true,
    },
    password: {
        name: '비밀번호',
        type: 'password',
        fieldname: 'password',
        keyname: 'password',
        isRequired: true,
        isUnique: false,
    },
    'confirmed-password': {
        name: '비밀번호 확인',
        type: 'password',
        fieldname: 'confirmedPassword',
        keyname: 'confirmed-password',
        isRequired: true,
        isUnique: false,
    },
    nickname: {
        name: '닉네임',
        type: 'text',
        fieldname: 'nickname',
        keyname: 'nickname',
        isRequired: true,
        isUnique: true,
    },
    /* posts */
    title: {
        name: '제목',
        type: 'text',
        fieldname: 'title',
        keyname: 'title',
        isRequired: true,
        isUnique: false,
    },
    content: {
        name: '내용',
        fieldname: 'content',
        keyname: 'content',
        isRequired: true,
        rows: 25,
    },
    /* 댓글 */
    comment: {
        name: '댓글',
        fieldname: 'content',
        keyname: 'comment',
        isRequired: true,
        rows: 8,
    },
    /* 이미지 */
    'member-image': {
        keyname: 'member-image',
        name: '프로필 이미지',
        imageHtml: (image) =>
            `<img class="form-member-image round-image" src="${image?.url ?? DEFAULT_MEMBER_IMAGE}" width="250" height="250" alt="member image" />`,
        isBtnOverlay: true,
    },
    'post-image': {
        keyname: 'post-image',
        name: '이미지',
        imageHtml: (image) =>
            `<input type="text" class="form-post-image" value="${image?.filename ?? '등록된 이미지가 없습니다'}" disabled />`,
        isBtnOverlay: false,
    },
};

const generateInputDivHtml = (attributes, value = '') => {
    return `
        <div>
            <label for="form-${attributes.keyname}-input" class="form-label">${attributes.name}</label>
            <input
                name="${attributes.name}"
                type="${attributes?.type ?? 'text'}"
                class="form-input ${attributes?.isRequired ? 'required' : ''}"
                id="form-${attributes.keyname}-input"
                placeholder="${attributes.name} 값을 입력해주세요"
                data-validated="${!!value ? true : false}"
                data-ischanged="false"
                data-fieldname="${attributes.fieldname}"
                data-keyname="${attributes.keyname}"
                data-unique="${attributes?.isUnique ?? false}"
                value="${value}"
                ${attributes?.disabled ? 'disabled' : ''}
            />
            <div class="form-helper-text form-helper-${attributes.keyname}"></div>
        </div>`;
};

const generateTextareaDivHtml = (attributes, value = '') => {
    return `
        <div>
        ${
            attributes.keyname === 'content'
                ? `<label for="form-${attributes.keyname}-input" class="form-label">${attributes.name}</label>`
                : ''
        }
            <textarea
                name="${attributes.name}"
                class="form-input ${attributes?.isRequired ? 'required' : ''}"
                id="form-${attributes.keyname}-input"
                placeholder="${attributes.name} 값을 입력해주세요"
                data-validated="${!!value ? true : false}"
                data-ischanged="false"
                data-fieldname="${attributes.fieldname}"
                data-keyname="${attributes.keyname}"
                data-unique="${attributes?.isUnique ?? false}"
                rows="${attributes?.rows ?? 8}"
            >${value}</textarea>
            <div class="form-helper-text form-helper-${attributes.keyname}"></div>
        </div>`;
};

const generateImageDivHtml = (attributes, image = {}) => {
    return `
        <div>
            <label for="form-${attributes.keyname}-input" class="form-label">${attributes.name}</label>
            <div class="form-${attributes.keyname}-container">
                ${attributes.imageHtml(image)}
                <div class="${attributes.isBtnOverlay ? 'overlay' : ''} form-image-btn-container">
                    <button type="button" class="btn form-image-update-btn">${!!image?.id ? '변경' : '등록'}</button>
                    <button type="button" class="btn form-image-delete-btn">삭제</button>
                </div>
            </div>
            <input
                name="${attributes.name}"
                class="form-input"
                type="file"
                id="form-image-input"
                data-ischanged="false"
                data-fieldname="image"
                data-keyname="${attributes.keyname}"
                style="display: none"
                data-value="${!!image?.id ? JSON.stringify({ id: image.id, objectKey: image.objectKey }) : 'null'}"
            />
            <div class="form-helper-text form-helper-${attributes.keyname}"></div>
        </div>`;
};

const formFieldDivHtmlGenerator = {
    email: generateInputDivHtml,
    'disabled-email': generateInputDivHtml,
    'unique-email': generateInputDivHtml,
    password: generateInputDivHtml,
    'confirmed-password': generateInputDivHtml,
    nickname: generateInputDivHtml,
    title: generateInputDivHtml,

    content: generateTextareaDivHtml,
    comment: generateTextareaDivHtml,

    'member-image': generateImageDivHtml,
    'post-image': generateImageDivHtml,
};

export const generateFormFieldDivHtml = (keyname, value = '') => {
    const generator = formFieldDivHtmlGenerator[keyname];
    return !generator ? '' : generator(defaultFieldAttributes[keyname], value);
};

export const generateSubmitBtnDivHtml = (value) => {
    return `
        <div>
            <button class="btn form-submit-btn inactivated" type="button" disabled>${value}</button>
        </div>`;
};
