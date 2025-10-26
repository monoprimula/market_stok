export const favoriteService = {
    getAll(userId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        return favorites[userId] || [];
    },

    add(userId, productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        if (!favorites[userId]) {
            favorites[userId] = [];
        }
        if (!favorites[userId].includes(productId)) {
            favorites[userId].push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            return true;
        }
        return false;
    },

    remove(userId, productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        if (favorites[userId]) {
            favorites[userId] = favorites[userId].filter(id => id !== productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            return true;
        }
        return false;
    },

    isFavorite(userId, productId) {
        const favorites = this.getAll(userId);
        return favorites.includes(productId);
    }
};
