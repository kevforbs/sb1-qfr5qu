import { todos, doneItems, renderTodoLists, createTodoDetails } from './todoManager.js';
import { formatDateForInput } from './utils.js';

export function openEditPopup(todo) {
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

export function openPopup() {
    const popup = document.getElementById('taskPopup');
    document.getElementById('isEditMode').value = 'false';
    document.getElementById('taskId').value = '';
    popup.style.display = 'flex';
    
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    
    document.getElementById('taskTimeFrom').value = now.toISOString().slice(0, 16);
    document.getElementById('taskTimeTo').value = later.toISOString().slice(0, 16);
}

export function closePopup() {
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

export function saveTask() {
    const isEditMode = document.getElementById('isEditMode').value === 'true';
    const todoId = parseInt(document.getElementById('taskId').value);
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
        const todo = todos.find(t => t.id === todoId) || doneItems.find(t => t.id === todoId);
        if (todo) {
            Object.assign(todo, {
                title,
                date: formattedDate,
                place,
                link,
                content: contents
            });
            
            // Update the details view
            const isDone = doneItems.some(t => t.id === todoId);
            document.getElementById('todoDetails').innerHTML = createTodoDetails(todo, isDone);
        }
    } else {
        const newId = Math.max(...todos.map(t => t.id), ...doneItems.map(t => t.id), 0) + 1;
        const newTodo = {
            id: newId,
            title,
            date: formattedDate,
            place,
            link,
            content: contents
        };
        todos.push(newTodo);
        
        // Show the new todo in details
        document.getElementById('todoDetails').innerHTML = createTodoDetails(newTodo, false);
    }

    closePopup();
    renderTodoLists();
}