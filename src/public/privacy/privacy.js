import { paintHeader } from '/component/common/header/header.js';
import { paintFooter } from '/component/common/footer/footer.js';

document.addEventListener('DOMContentLoaded', () => {
    paintHeader();
    const bodyElement = document.querySelector('body');
    const mainElement = bodyElement.querySelector('main');
    paintFooter(bodyElement, mainElement);
});
