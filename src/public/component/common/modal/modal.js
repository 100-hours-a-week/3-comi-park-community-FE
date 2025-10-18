export const openDeleteModal = (domain, id) => {
    const modal = document.querySelector('dialog');
    modal.dataset.domain = domain; // post, comment
    modal.dataset.id = id;

    modal.showModal();
};
