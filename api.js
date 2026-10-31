const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const noteCategory = document.getElementById('note-category');
const errorMessage = document.getElementById('error-message');
const notesList = document.getElementById('notes-list');
const searchInput = document.getElementById('search-input');
const noteCount = document.getElementById('note-count');

let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

// Project 1 Feedback Fix: Sanitize category names with spaces for CSS classes
function sanitizeCategory(category) {
    return category.trim().toLowerCase().replace(/\s+/g, '-');
}

function renderNotes(filterText = '') {
    notesList.innerHTML = ''; 
    
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(filterText.toLowerCase()) || 
        note.category.toLowerCase().includes(filterText.toLowerCase())
    );

    noteCount.textContent = `${filteredNotes.length} note${filteredNotes.length !== 1 ? 's' : ''}`;

    filteredNotes.forEach(note => {
        // Project 1 Feedback Fix: DOM element creation instead of template literals
        const li = document.createElement('li');
        li.className = `note-card category-${sanitizeCategory(note.category)}`;

        const textPara = document.createElement('p');
        // Project 1 Feedback Fix: Using textContent to prevent XSS vulnerabilities
        textPara.textContent = note.text; 

        const metaDiv = document.createElement('div');
        metaDiv.className = 'note-date';
        
        const catSpan = document.createElement('span');
        catSpan.className = 'note-category-label';
        catSpan.textContent = note.category;
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = ` • ${new Date(note.timestamp).toLocaleString()}`;

        metaDiv.appendChild(catSpan);
        metaDiv.appendChild(dateSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteNote(note.id);

        li.appendChild(textPara);
        li.appendChild(metaDiv);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = noteInput.value.trim();
    const category = noteCategory.value.trim() || 'Personal';

    // Project 1 Feedback Fix: Custom validation handling since 'required' HTML attribute was removed
    if (!text) {
        errorMessage.textContent = 'Please enter note text before submitting.';
        return;
    }
    
    errorMessage.textContent = ''; 

    const newNote = {
        id: Date.now().toString(),
        text: text,
        category: category,
        timestamp: Date.now()
    };

    notes.push(newNote);
    saveNotes();
    
    noteInput.value = '';
    noteCategory.value = '';
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
}

function saveNotes() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
    renderNotes(searchInput.value);
}

searchInput.addEventListener('input', (e) => {
    renderNotes(e.target.value);
});

renderNotes();