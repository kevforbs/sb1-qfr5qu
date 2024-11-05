import { renderTodoLists } from './todoManager.js';
import { openPopup, openEditPopup, closePopup, saveTask } from './popupManager.js';
import { updateDateTime } from './utils.js';

// Initialize navigation
document.querySelectorAll('.nav-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        document.querySelectorAll('.nav-icon').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        icon.classList.add('active');
        document.getElementById(icon.dataset.page).classList.add('active');
    });
});

// Add update button functionality
document.getElementById('updateButton').addEventListener('click', () => {
    location.reload();
});

// Expose necessary functions to window for HTML onclick handlers
window.todoApp = {
    openPopup,
    openEditPopup,
    closePopup,
    saveTask
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderTodoLists();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});