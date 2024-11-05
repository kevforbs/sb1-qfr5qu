// Todo functionality
let currentTodo = null;

function openOutlook() {
    window.location.href = 'mailto:';
}

function formatDateForInput(dateStr) {
    try {
        const date = new Date(dateStr.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
        return date.toISOString().slice(0, 16);
    } catch (e) {
        console.error('Date formatting error:', e);
        return '';
    }
}

function createTodoItem(todo) {
    const status = todo.status === 'done' ? 'done' : todo.status || 'pending';
    return `
        <div class="todo-item ${status}" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" ${status === 'done' ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-item-title">${todo.title}</div>
                <div class="todo-item-date">${todo.date}</div>
            </div>
            <i class="far fa-envelope todo-email" onclick="openOutlook()"></i>
        </div>
    `;
}

function createTodoDetails(todo, isDone = false) {
    currentTodo = todo;
    const formattedDate = formatDateForInput(todo.date);
    return `
        <div class="todo-details" data-id="${todo.id}">
            <div class="details-header">
                <button class="todo-button edit-btn" onclick="openEditPopup(${JSON.stringify(todo).replace(/"/g, '&quot;')})">
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
                    <label>Start Time:</label>
                    <input type="datetime-local" value="${formattedDate}" class="details-input" readonly>
                </div>
                <div class="time-input-group">
                    <label>End Time:</label>
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
                <i class="far fa-envelope" onclick="openOutlook()"></i>
            </div>
        </div>
    `;
}

async function toggleTodo(todoId, done) {
    try {
        const response = await fetch(`/api/todos/${todoId}/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done })
        });
        
        if (!response.ok) {
            throw new Error('Failed to toggle todo');
        }
        
        await renderTodoLists();
    } catch (error) {
        console.error('Error toggling todo:', error);
        alert('Failed to toggle todo status');
    }
}

async function fetchTodos() {
    try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return { todos: [], done_items: [] };
    }
}

async function updateCurrentTime() {
    try {
        const response = await fetch('/api/current-time');
        const data = await response.json();
        document.getElementById('currentDate').textContent = data.datetime;
    } catch (error) {
        console.error('Error updating time:', error);
    }
}

async function renderTodoLists() {
    const { todos, done_items } = await fetchTodos();
    const todoList = document.getElementById('todoList');
    const doneList = document.getElementById('doneList');
    
    todoList.innerHTML = todos.map(createTodoItem).join('');
    doneList.innerHTML = done_items.map(createTodoItem).join('');

    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoId = parseInt(this.closest('.todo-item').dataset.id);
            toggleTodo(todoId, this.checked);
        });
    });

    document.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('todo-checkbox') || e.target.classList.contains('todo-email')) {
                return;
            }
            const todoId = parseInt(this.dataset.id);
            const todo = todos.find(t => t.id === todoId) || done_items.find(t => t.id === todoId);
            const isDone = done_items.some(t => t.id === todoId);
            if (todo) {
                document.getElementById('todoDetails').innerHTML = createTodoDetails(todo, isDone);
            }
        });
    });
}