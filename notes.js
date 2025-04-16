// DOM Elements
const addNoteBtn = document.getElementById('add-note');
const clearAllBtn = document.getElementById('clear-all');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-notes');
const sortSelect = document.getElementById('sort-by');
const colorFilters = document.querySelectorAll('.color-filters .color-option');

// Note colors
const colors = {
    yellow: '#fff176',
    green: '#aed581',
    blue: '#81d4fa',
    pink: '#f8bbd0',
    purple: '#d1c4e9'
};

// Variables for filtering and sorting
let currentFilter = 'all';
let currentSort = 'newest';
let searchTerm = '';

// Load notes from local storage
document.addEventListener('DOMContentLoaded', () => {
    // Set event listeners for the filter options
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    colorFilters.forEach(filter => {
        filter.addEventListener('click', handleColorFilter);
    });
    
    loadNotes();
});

// Event Listeners for buttons
if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => addNewNote());
}

if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllNotes);
}

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
    return note;
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
        
        if (title || content) { // Only save notes that have title or content
            notes.push({
                id,
                title,
                content,
                color: colorClass,
                timestamp: parseInt(id) // Convert id string to number
            });
        }
    });
    
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('sticky-notes')) || [];
    
    // Clear the container before loading notes
    if (notesContainer) {
        notesContainer.innerHTML = '';
        
        if (savedNotes.length > 0) {
            // Apply filters and sorting before rendering
            const filteredNotes = filterNotes(savedNotes);
            const sortedNotes = sortNotes(filteredNotes);
            
            sortedNotes.forEach(note => {
                addNewNote(note.title, note.content, note.color, note.id);
            });
        } else {
            // Add a default welcome note
            addNewNote('Welcome to Notes!', 'This is your organized notes section. You can search, sort, and filter your notes here.');
        }
    }
}

function clearAllNotes() {
    if (confirm('Are you sure you want to delete all notes?')) {
        notesContainer.innerHTML = '';
        localStorage.removeItem('sticky-notes');
    }
}

function handleSearch() {
    searchTerm = searchInput.value.toLowerCase();
    loadNotes();
}

function handleSort() {
    currentSort = sortSelect.value;
    loadNotes();
}

function handleColorFilter(e) {
    // Update active state in UI
    colorFilters.forEach(filter => {
        filter.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Update filter value
    currentFilter = e.target.dataset.color;
    loadNotes();
}

function filterNotes(notes) {
    return notes.filter(note => {
        // Filter by search term
        const matchesSearch = 
            (note.title && note.title.toLowerCase().includes(searchTerm)) || 
            (note.content && note.content.toLowerCase().includes(searchTerm));
        
        // Filter by color
        const matchesColor = currentFilter === 'all' || note.color === currentFilter;
        
        return matchesSearch && matchesColor;
    });
}

function sortNotes(notes) {
    return notes.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return b.timestamp - a.timestamp;
            case 'oldest':
                return a.timestamp - b.timestamp;
            case 'alphabetical':
                return (a.title || '').localeCompare(b.title || '');
            default:
                return 0;
        }
    });
}

// Add animation for note deletion
const style = document.createElement('style');
style.textContent = `
    .note.deleting {
        transform: scale(0.8);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .color-filters .color-option {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        display: inline-block;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin-right: 5px;
    }
    
    .color-filters .color-option.yellow { background-color: #fff176; }
    .color-filters .color-option.green { background-color: #aed581; }
    .color-filters .color-option.blue { background-color: #81d4fa; }
    .color-filters .color-option.pink { background-color: #f8bbd0; }
    .color-filters .color-option.purple { background-color: #d1c4e9; }
    
    .color-filters .color-option.all {
        background: linear-gradient(to right, #fff176, #aed581, #81d4fa, #f8bbd0, #d1c4e9);
    }
    
    .color-filters .color-option.active {
        border: 2px solid #333;
    }
    
    .search-filter {
        margin-bottom: 20px;
    }
    
    #search-notes {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(5px);
        outline: none;
    }
    
    .filter-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }
`;
document.head.appendChild(style);