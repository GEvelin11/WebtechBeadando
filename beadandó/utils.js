export function validateId(id) {
    return id && (typeof id === 'number' || !isNaN(id)) && id > 0;
}

export function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU');
    } catch {
        return dateString;
    }
}
