import { getStatus, formatDateForInput, openOutlook } from './utils.js';

// Initial todos data
export const initialTodos = [
    { 
        id: 1, 
        title: 'Review Project Proposal', 
        date: '2025/12/30 14:30', 
        place: 'Conference Room A',
        link: 'https://meet.google.com/abc',
        content: 'Review Q4 project proposals' 
    },
    { 
        id: 2, 
        title: 'Team Meeting', 
        date: '2025/12/30 09:00', 
        place: 'Meeting Room B',
        link: 'https://zoom.us/j/123',
        content: 'Weekly team sync meeting' 
    },
    { 
        id: 3, 
        title: 'Client Presentation', 
        date: '2025/12/30 15:00', 
        place: 'Board Room',
        link: 'https://teams.microsoft.com/123',
        content: 'Present Q4 results to client' 
    },
    { 
        id: 4, 
        title: 'Submit Monthly Report', 
        date: '2025/12/30 17:00', 
        place: 'Office',
        link: 'https://docs.google.com/report',
        content: 'Complete and submit monthly progress report' 
    },
    { 
        id: 5, 
        title: 'Project Deadline', 
        date: '2024/09/01 16:00', 
        place: 'Development Lab',
        link: 'https://github.com/project',
        content: 'Final code submission for Project X' 
    },
    { 
        id: 6, 
        title: 'Weekly Planning', 
        date: '2024/09/10 10:00', 
        place: 'Planning Room',
        link: 'https://trello.com/board',
        content: 'Plan next week\'s activities and assignments' 
    },
    { 
        id: 7, 
        title: 'Client Meeting', 
        date: '2024/09/12 13:30', 
        place: 'Virtual Meeting Room',
        link: 'https://meet.google.com/xyz',
        content: 'Discuss project requirements with client' 
    }
];

export let todos = [...initialTodos];
export let doneItems = [];

export function createTodoItem(todo, isDone = false) {
    const status = isDone ? 'done' : getStatus(todo.date);
    return `
        <div class="todo-item ${status}" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" ${isDone ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-item-title">${todo.title}</div>
                <div class="todo-item-date">${todo.date}</div>
            </div>
            <i class="far fa-envelope todo-email" onclick="todoApp.openOutlook(${JSON.stringify(todo).replace(/"/g, '&quot;')})"></i>
        </div>
    `;
}

export function createTodoDetails(todo, isDone = false) {
    const formattedDate = formatDateForInput(todo.date);
    return `
        <div class="todo-details" data-id="${todo.id}">
            <div class="details-header">
                <button class="todo-button edit-btn" onclick="todoApp.openEditPopup(${JSON.stringify(todo).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <h2 class="details-title">${isDone ? 'Done' : 'To Do'}</h2>
            <div class="details-row">
                <label>Title:</label>
                <input type="text" value="${todo.title}" class="details-input" readonly>
            </div>
            <div class="details-row time-row">
                <div class="time-input-group">
                    <label>Time:</label>
                    <input type="datetime-local" value="${formattedDate}" class="details-input" readonly>
                </div>
            </div>
            <div class="details-row">
                <label>Place:</label>
                <input type="text" value="${todo.place || ''}" class="details-input" readonly>
            </div>
            <div class="details-row">
                <label>Link:</label>
                <input type="text" value="${todo.link || ''}" class="details-input" readonly>
            </div>
            <div class="details-row">
                <label>Content:</label>
                <textarea class="details-textarea" readonly>${todo.content || ''}</textarea>
            </div>
            <div class="details-email">
                <i class="far fa-envelope" onclick="todoApp.openOutlook(${JSON.stringify(todo).replace(/"/g, '&quot;')})"></i>
            </div>
        </div>
    `;
}

export function renderTodoLists() {
    const todoList = document.getElementById('todoList');
    const doneList = document.getElementById('doneList');
    
    const sortedTodos = [...todos].sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedDone = [...doneItems].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    todoList.innerHTML = sortedTodos.map(todo => createTodoItem(todo, false)).join('');
    doneList.innerHTML = sortedDone.map(todo => createTodoItem(todo, true)).join('');

    // Add click event listeners for todo items
    document.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('todo-checkbox') || e.target.classList.contains('todo-email')) {
                return;
            }
            const todoId = parseInt(this.dataset.id);
            const todo = todos.find(t => t.id === todoId) || doneItems.find(t => t.id === todoId);
            const isDone = doneItems.some(t => t.id === todoId);
            if (todo) {
                document.getElementById('todoDetails').innerHTML = createTodoDetails(todo, isDone);
            }
        });
    });

    // Add checkbox event listeners
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoId = parseInt(this.closest('.todo-item').dataset.id);
            toggleTodo(todoId, this.checked);
        });
    });
}

export function toggleTodo(todoId, done) {
    if (done) {
        const todoIndex = todos.findIndex(t => t.id === todoId);
        if (todoIndex !== -1) {
            const todo = todos.splice(todoIndex, 1)[0];
            doneItems.unshift(todo);
        }
    } else {
        const doneIndex = doneItems.findIndex(t => t.id === todoId);
        if (doneIndex !== -1) {
            const todo = doneItems.splice(doneIndex, 1)[0];
            todos.push(todo);
        }
    }
    renderTodoLists();
}