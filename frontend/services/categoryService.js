export const categoryService = {
    getAll() {
        return JSON.parse(localStorage.getItem('categories') || '[]');
    },

    getById(id) {
        const categories = this.getAll();
        return categories.find(c => c.id === id);
    },

    create(categoryData) {
        const categories = this.getAll();
        const newCategory = {
            id: Date.now().toString(),
            ...categoryData,
            createdAt: new Date().toISOString()
        };
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        return newCategory;
    },

    update(id, categoryData) {
        const categories = this.getAll();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...categoryData };
            localStorage.setItem('categories', JSON.stringify(categories));
            return categories[index];
        }
        return null;
    },

    delete(id) {
        const categories = this.getAll();
        const filtered = categories.filter(c => c.id !== id);
        localStorage.setItem('categories', JSON.stringify(filtered));
        return true;
    }
};
