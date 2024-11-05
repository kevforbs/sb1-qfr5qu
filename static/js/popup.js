// Popup functionality
function openEditPopup(todo) {
    const popup = document.getElementById('taskPopup');
    document.getElementById('taskId').value = todo.id;
    document.getElementById('isEditMode').value = 'true';
    document.getElementById('taskTitle').value = todo.title;
    document.getElementById('taskTimeFrom').value = formatDateForInput(todo.date);
    document.getElementById('taskTimeTo').value = formatDateForInput(todo.date);
    document.getElementById('taskPlace').value = todo.place || '';
    document.getElementById('taskLink').value = todo.link || '';
    document.getElementById('taskContents').value = todo.content || '';
    
    popup.style.display = 'flex';
}

function openPopup() {
    const popup = document.getElementById('taskPopup');
    document.getElementById('isEditMode').value = 'false';
    document.getElementById('taskId').value = '';
    popup.style.display = 'flex';
    
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    
    document.getElementById('taskTimeFrom').value = now.toISOString().slice(0, 16);
    document.getElementById('taskTimeTo').value = later.toISOString().slice(0, 16);
}

function closePopup() {
    const popup = document.getElementById('taskPopup');
    popup.style.display = 'none';
    clearPopupFields();
}

function clearPopupFields() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskTimeFrom').value = '';
    document.getElementById('taskTimeTo').value = '';
    document.getElementById('taskPlace').value = '';
    document.getElementById('taskLink').value = '';
    document.getElementById('taskContents').value = '';
}

async function saveTask() {
    const isEditMode = document.getElementById('isEditMode').value === 'true';
    const todoId = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const timeFrom = document.getElementById('taskTimeFrom').value;
    const timeTo = document.getElementById('taskTimeTo').value;
    const place = document.getElementById('taskPlace').value;
    const link = document.getElementById('taskLink').value;
    const contents = document.getElementById('taskContents').value;
    
    if (!title || !timeFrom || !timeTo) {
        alert('Please fill in all required fields (Title and Time)');
        return;
    }

    const fromDate = new Date(timeFrom);
    const formattedDate = `${fromDate.getFullYear()}/${String(fromDate.getMonth() + 1).padStart(2, '0')}/${String(fromDate.getDate()).padStart(2, '0')} ${String(fromDate.getHours()).padStart(2, '0')}:${String(fromDate.getMinutes()).padStart(2, '0')}`;

    if (isEditMode) {
        try {
            const response = await fetch(`/api/todos/${todoId}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    date: formattedDate,
                    place,
                    link,
                    content: contents
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo');
            return;
        }
    }

    closePopup();
    await renderTodoLists();
}