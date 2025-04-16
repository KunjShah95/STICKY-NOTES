// DOM Elements
const addNoteBtn = document.getElementById('add-note');
const clearAllBtn = document.getElementById('clear-all');
const notesContainer = document.getElementById('notes-container');

// Note colors
const colors = {
    yellow: '#fff176',
    green: '#aed581',
    blue: '#81d4fa',
    pink: '#f8bbd0',
    purple: '#d1c4e9'
};

// Load notes from local storage
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

// Event Listeners
addNoteBtn.addEventListener('click', () => addNewNote());
clearAllBtn.addEventListener('click', clearAllNotes);

// Functions
function addNewNote(title = '', content = '', color = 'yellow', id = Date.now()) {
    const note = document.createElement('div');
    note.className = `note ${color}`;
    note.dataset.id = id;
    
    note.innerHTML = `
        <div class="note-actions">
            <button class="delete-note">✕</button>
        </div>
        <input type="text" class="note-title" placeholder="Title" value="${title}">
        <textarea class="note-content" placeholder="Write your note here...">${content}</textarea>
        <div class="note-colors">
            <div class="color-option yellow" data-color="yellow"></div>
            <div class="color-option green" data-color="green"></div>
            <div class="color-option blue" data-color="blue"></div>
            <div class="color-option pink" data-color="pink"></div>
            <div class="color-option purple" data-color="purple"></div>
        </div>
    `;
    
    notesContainer.prepend(note);
    
    // Add event listeners to the new note
    const deleteBtn = note.querySelector('.delete-note');
    deleteBtn.addEventListener('click', deleteNote);
    
    const colorOptions = note.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', changeNoteColor);
    });
    
    const noteTitle = note.querySelector('.note-title');
    const noteContent = note.querySelector('.note-content');
    
    [noteTitle, noteContent].forEach(element => {
        element.addEventListener('input', saveNotes);
        element.addEventListener('blur', saveNotes);
    });
    
    saveNotes();
}

function deleteNote(e) {
    const note = e.target.closest('.note');
    note.classList.add('deleting');
    
    // Animation before removing
    setTimeout(() => {
        note.remove();
        saveNotes();
    }, 300);
}

function changeNoteColor(e) {
    const colorName = e.target.dataset.color;
    const note = e.target.closest('.note');
    
    // Remove all color classes
    Object.keys(colors).forEach(color => {
        note.classList.remove(color);
    });
    
    // Add the selected color class
    note.classList.add(colorName);
    saveNotes();
}

function saveNotes() {
    const notes = [];
    
    document.querySelectorAll('.note').forEach(noteEl => {
        const id = noteEl.dataset.id;
        const title = noteEl.querySelector('.note-title').value;
        const content = noteEl.querySelector('.note-content').value;
        const colorClass = Array.from(noteEl.classList)
            .find(cls => Object.keys(colors).includes(cls));
        
        notes.push({
            id,
            title,
            content,
            color: colorClass,
            timestamp: id // Using the id as timestamp since it's Date.now()
        });
    });
    
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('sticky-notes')) || [];
    
    // Clear the container before loading notes
    notesContainer.innerHTML = '';
    
    if (savedNotes.length > 0) {
        // Display most recent notes first
        savedNotes.sort((a, b) => b.timestamp - a.timestamp)
            .forEach(note => {
                addNewNote(note.title, note.content, note.color, note.id);
            });
    } else {
        // Add a default welcome note
        addNewNote('Welcome!', 'This is your new sticky notes app. Add notes, change colors, and never forget your ideas again!');
    }
}

function clearAllNotes() {
    if (confirm('Are you sure you want to delete all notes?')) {
        notesContainer.innerHTML = '';
        localStorage.removeItem('sticky-notes');
    }
}

// Add animation for deletion
const style = document.createElement('style');
style.textContent = `
    .note.deleting {
        transform: scale(0.8);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
`;
document.head.appendChild(style);