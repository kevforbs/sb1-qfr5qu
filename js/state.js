// State management for the todo application
const STATE_KEY = 'todoAppState';

export function saveState(todos, doneItems) {
    const state = {
        todos,
        doneItems,
        version: 'Test1'
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function loadState() {
    try {
        const state = JSON.parse(localStorage.getItem(STATE_KEY));
        if (state && state.version === 'Test1') {
            return {
                todos: state.todos || [],
                doneItems: state.doneItems || []
            };
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
    return null;
}