export const logService = {
    getAll() {
        return JSON.parse(localStorage.getItem('logs') || '[]');
    },

    add(action, details, userId, userRole) {
        const logs = this.getAll();
        const newLog = {
            id: Date.now().toString(),
            action,
            details,
            userId,
            userRole,
            timestamp: new Date().toISOString()
        };
        logs.unshift(newLog);
        localStorage.setItem('logs', JSON.stringify(logs));
        return newLog;
    },

    clear() {
        localStorage.setItem('logs', '[]');
    },

    exportToCSV() {
        const logs = this.getAll();
        const headers = ['Tarih', 'İşlem', 'Detay', 'Kullanıcı Rolü'];
        const rows = logs.map(log => [
            new Date(log.timestamp).toLocaleString('tr-TR'),
            log.action,
            log.details,
            log.userRole
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
};
