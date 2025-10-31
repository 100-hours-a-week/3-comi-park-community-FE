import { API_SERVER_URI } from '../../../utils/constants.js';

const createAnchorElement = (href, content) => {
    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('href', href);
    anchorElement.textContent = content;

    return anchorElement;
};

export const paintFooter = (sectionElement) => {
    const footerElement = document.createElement('footer');

    footerElement.appendChild(createAnchorElement(`${API_SERVER_URI}/terms`, '이용약관'));
    footerElement.appendChild(createAnchorElement(`${API_SERVER_URI}/privacy`, '개인정보처리방침'));

    sectionElement.appendChild(footerElement);
};
