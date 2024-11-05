import { todos, doneItems, renderTodoLists, createTodoDetails } from './todoManager.js';
import { formatDateForInput, updateDateTime, openOutlook } from './utils.js';

export async function initializeApp() {
    // Navigation functionality
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.nav-icon').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            icon.classList.add('active');
            document.getElementById(icon.dataset.page).classList.add('active');
        });
    });

    document.getElementById('updateButton').addEventListener('click', () => {
        location.reload();
    });

    // Initialize the page
    renderTodoLists();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Return public methods
    return {
        openPopup,
        closePopup,
        saveTask,
        openEditPopup,
        openOutlook
    };
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

function saveTask() {
    const taskType = document.getElementById('taskType').value;
    const isEditMode = document.getElementById('isEditMode').value === 'true';
    const todoId = parseInt(document.getElementById('taskId').value);
    const title = document.getElementById('taskTitle').value;
    const timeFrom = document.getElementById('taskTimeFrom').value;
    const place = document.getElementById('taskPlace').value;
    const link = document.getElementById('taskLink').value;
    const contents = document.getElementById('taskContents').value;
    
    if (!title || !timeFrom) {
        alert('Please fill in all required fields (Title and Time)');
        return;
    }

    const fromDate = new Date(timeFrom);
    const formattedDate = `${fromDate.getFullYear()}/${String(fromDate.getMonth() + 1).padStart(2, '0')}/${String(fromDate.getDate()).padStart(2, '0')} ${String(fromDate.getHours()).padStart(2, '0')}:${String(fromDate.getMinutes()).padStart(2, '0')}`;

    if (isEditMode) {
        const todo = todos.find(t => t.id === todoId) || doneItems.find(t => t.id === todoId);
        if (todo) {
            todo.title = title;
            todo.date = formattedDate;
            todo.place = place;
            todo.link = link;
            todo.content = contents;
            
            // Update details view if this todo is currently displayed
            const detailsContainer = document.getElementById('todoDetails');
            const isDone = doneItems.some(t => t.id === todoId);
            detailsContainer.innerHTML = createTodoDetails(todo, isDone);
        }
    } else if (taskType === 'todo') {
        const newId = Math.max(...todos.map(t => t.id), ...doneItems.map(t => t.id), 0) + 1;
        const newTask = {
            id: newId,
            title,
            date: formattedDate,
            place,
            link,
            content: contents
        };
        todos.push(newTask);
        
        // Show the new todo in details
        document.getElementById('todoDetails').innerHTML = createTodoDetails(newTask, false);
    }

    closePopup();
    renderTodoLists();
}