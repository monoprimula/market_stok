export function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    const closeModal = () => {
        modal.remove();
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    return modal;
}

export function showConfirmModal(message, onConfirm) {
    const content = `
        <p>${message}</p>
        <div class="modal-actions">
            <button class="btn btn-secondary" id="cancelBtn">İptal</button>
            <button class="btn btn-danger" id="confirmBtn">Onayla</button>
        </div>
    `;

    const modal = createModal('Onay', content);
    document.body.appendChild(modal);

    modal.querySelector('#confirmBtn').addEventListener('click', () => {
        onConfirm();
        modal.remove();
    });

    modal.querySelector('#cancelBtn').addEventListener('click', () => {
        modal.remove();
    });
}
