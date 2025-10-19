/* HTML */
const generateModalHtml = (mainText, subText) => {
    return `
        <dialog data-type="" data-id="">
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

export const paintModal = ({ mainText = '', subText = '', onCancel, onConfirm }) => {
    document.querySelector('section').insertAdjacentHTML('beforeend', generateModalHtml(mainText, subText));

    const modal = document.querySelector('dialog');

    document.querySelector('.modal-cancel-btn').addEventListener('click', async () => {
        modal.close();

        if (onCancel instanceof Function) {
            await onCancel();
        }
    });

    document.querySelector('.modal-confirm-btn').addEventListener('click', async () => {
        modal.close();

        if (onConfirm instanceof Function) {
            await onConfirm();
        }
    });
};

/* Event */
export const openDeleteModal = (domain, id) => {
    const modal = document.querySelector('dialog');
    modal.dataset.domain = domain; // post, comment
    modal.dataset.id = id;

    modal.showModal();
};
