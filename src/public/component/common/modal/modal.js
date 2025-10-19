/* HTML */
const generateModalHtml = (mainText, subText, domain, id) => {
    return `
        <dialog data-type="${domain}" data-id="${id}">
            <div class="modal-container">
                <div class="modal-main-text">${mainText}</div>
                <div class="modal-sub-text">${subText}</div>
                <div class="modal-buttons">
                    <button type="button" class="btn modal-cancel-btn">취소</button>
                    <button type="button" class="btn modal-confirm-btn">확인</button>
                </div>
            </div>
        </dialog>`;
};

/* Event */
/**
 * 매개변수(mainText, subText, dataset)을 활용해 Modal HTML 동적 생성합니다.
 * 동적 생성한 HTML을 section 태그의 마지막 자식으로 추가한 후 모달창을 오픈합니다.
 *
 * 취소나 확인 버튼을 클릭하면 모달 창을 닫음과 동시에 secion 태그의 자식에서 모달을 제거합니다.
 * 추가로 onCancel, onConfirm으로 취소/확인 버튼 클릭 후 추가로 진행할 작업이 있다면 실행합니다.
 */
export const openModal = ({ mainText = '', subText = '', dataset = { domain: '', id: '' }, onCancel, onConfirm }) => {
    const addClickEventOnModalCancelBtn = () => {
        document.querySelector('.modal-cancel-btn').addEventListener('click', async () => {
            modal.close();
            section.removeChild(modal);

            if (onCancel instanceof Function) {
                await onCancel();
            }
        });
    };

    const addClickEventOnModalConfirmBtn = () => {
        document.querySelector('.modal-confirm-btn').addEventListener('click', async () => {
            modal.close();
            section.removeChild(modal);

            if (onConfirm instanceof Function) {
                await onConfirm();
            }
        });
    };

    const section = document.querySelector('section');
    section.insertAdjacentHTML('beforeend', generateModalHtml(mainText, subText, dataset.domain, dataset.id));

    const modal = document.querySelector('dialog');
    modal.showModal();

    addClickEventOnModalCancelBtn();
    addClickEventOnModalConfirmBtn();
};
