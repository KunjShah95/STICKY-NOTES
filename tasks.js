// DOM Elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const priorityFilter = document.getElementById('priority-filter');
const tasksCountElement = document.getElementById('tasks-count');
const completedCountElement = document.getElementById('completed-count');
const clearCompletedBtn = document.getElementById('clear-completed');

// Variables for filtering
let currentFilter = 'all';
let currentPriorityFilter = 'all';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    // Set default due date to today
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.value = today;
    
    // Add event listeners
    addTaskBtn.addEventListener('click', addTask);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            loadTasks();
        });
    });
    
    priorityFilter.addEventListener('change', () => {
        currentPriorityFilter = priorityFilter.value;
        loadTasks();
    });
});

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }
    
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
    
    // Create new task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        dueDate: dueDate,
        priority: priority,
        timestamp: Date.now()
    };
    
    // Add to local storage
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    
    // Clear input fields
    taskInput.value = '';
    
    // Reload tasks
    loadTasks();
    
    // Focus back on input
    taskInput.focus();
}

// Load tasks from local storage
function loadTasks() {
    const tasks = getTasks();
    
    // Apply filters
    const filteredTasks = tasks.filter(task => {
        // Filter by completion status
        if (currentFilter === 'active' && task.completed) return false;
        if (currentFilter === 'completed' && !task.completed) return false;
        
        // Filter by priority
        if (currentPriorityFilter !== 'all' && task.priority !== currentPriorityFilter) return false;
        
        return true;
    });
    
    // Sort tasks: first by completion status, then by priority, then by due date
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
        
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    // Clear current list
    taskList.innerHTML = '';
    
    // Add filtered tasks to the list
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    // Update counts
    updateTaskCounts();
}

// Create a task element
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <p class="task-text">${task.text}</p>
        </div>
        <div class="task-details">
            <span class="task-due-date">${formattedDate}</span>
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
            <div class="task-actions">
                <button class="edit-task">✏️</button>
                <button class="delete-task">🗑️</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('.task-checkbox');
    const editBtn = taskItem.querySelector('.edit-task');
    const deleteBtn = taskItem.querySelector('.delete-task');
    
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
    editBtn.addEventListener('click', () => editTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return taskItem;
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        loadTasks();
    }
}

// Edit task
function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        taskInput.value = task.text;
        dueDateInput.value = task.dueDate;
        prioritySelect.value = task.priority;
        
        // Delete the task immediately
        deleteTask(taskId);
        
        // Focus on the input
        taskInput.focus();
    }
}

// Delete task
function deleteTask(taskId) {
    const tasks = getTasks().filter(task => task.id !== taskId);
    saveTasks(tasks);
    
    // Find the task element and add deletion animation
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.add('deleting');
        setTimeout(() => {
            loadTasks();
        }, 300);
    } else {
        loadTasks();
    }
}

// Clear all completed tasks
function clearCompletedTasks() {
    const tasks = getTasks();
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    if (tasks.length !== incompleteTasks.length) {
        saveTasks(incompleteTasks);
        loadTasks();
    }
}

// Update task counts
function updateTaskCounts() {
    const tasks = getTasks();
    const completedTasks = tasks.filter(task => task.completed);
    
    tasksCountElement.textContent = tasks.length;
    completedCountElement.textContent = completedTasks.length;
}

// Get tasks from local storage
function getTasks() {
    return JSON.parse(localStorage.getItem('sticky-tasks')) || [];
}

// Save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('sticky-tasks', JSON.stringify(tasks));
}