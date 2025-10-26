export function createCard(title, content, actions = []) {
    const card = document.createElement('div');
    card.className = 'card';

    const actionsHTML = actions.length > 0 ? `
        <div class="card-actions">
            ${actions.map(action => `
                <button class="btn btn-${action.type || 'primary'}" data-action="${action.id}">
                    ${action.label}
                </button>
            `).join('')}
        </div>
    ` : '';

    card.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
        </div>
        <div class="card-body">
            ${content}
        </div>
        ${actionsHTML}
    `;

    actions.forEach(action => {
        const btn = card.querySelector(`[data-action="${action.id}"]`);
        if (btn && action.onClick) {
            btn.addEventListener('click', action.onClick);
        }
    });

    return card;
}
