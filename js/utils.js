export function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function getStatus(dateStr) {
    const itemDate = new Date(dateStr);
    const now = new Date();
    return itemDate < now ? 'overdue' : 'pending';
}

export function openOutlook(todo) {
    const subject = encodeURIComponent(todo.title);
    const body = encodeURIComponent(
        `Date: ${todo.date}\n` +
        `Place: ${todo.place}\n` +
        `Link: ${todo.link}\n\n` +
        `${todo.content}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export function updateDateTime() {
    const now = new Date();
    const formatted = now.getFullYear() + '/' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                    String(now.getDate()).padStart(2, '0') + ' ' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentDate').textContent = formatted;
}