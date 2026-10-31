// Base API URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM Element Selections
const loadBtn = document.getElementById('load-btn');
const statusDisplay = document.getElementById('status-display');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('note-title');
const bodyInput = document.getElementById('note-body');
const submitBtn = document.getElementById('submit-btn');
const notesList = document.getElementById('notes-list');

// Helper function to update the status display on the screen
function updateStatus(message, isError = false) {
    statusDisplay.textContent = message;
    statusDisplay.style.color = isError ? 'red' : 'green';
}

// Reusable async function for API calls
async function apiRequest(endpoint = '', method = 'GET', data = null) {
    // 1. Set loading state and disable buttons to prevent duplicate requests
    updateStatus('Loading...', false);
    loadBtn.disabled = true;
    submitBtn.disabled = true;

    const options = {
        method: method,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    };

    // If there is data (like when creating a note), attach it to the body
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // 2. Set success state
        updateStatus('Request successful!', false);
        
        // Clear the success message after 3 seconds so the screen stays clean
        setTimeout(() => {
            if (statusDisplay.textContent === 'Request successful!') {
                statusDisplay.textContent = '';
            }
        }, 3000);

        return result;
        
    } catch (error) {
        // 3. Handle network errors gracefully
        console.error('API Error:', error);
        updateStatus('Network error or server failure. Please try again.', true);
        return null;
        
    } finally {
        // 4. Always re-enable buttons, whether the request succeeded or failed
        loadBtn.disabled = false;
        submitBtn.disabled = false;
    }
}

// Safely build the DOM elements for a single note
function createNoteElement(note) {
    const li = document.createElement('li');
    li.className = 'note-card';
    li.dataset.id = note.id;

    const titleHeading = document.createElement('h3');
    titleHeading.textContent = note.title; // Safe from XSS

    const bodyPara = document.createElement('p');
    bodyPara.textContent = note.body; // Safe from XSS

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteNote(note.id, li);

    li.appendChild(titleHeading);
    li.appendChild(bodyPara);
    li.appendChild(deleteBtn);

    return li;
}

// Fetch notes from the API and render them
async function loadNotes() {
    notesList.innerHTML = ''; // Clear the current list
    
    // Fetch posts from JSONPlaceholder (limiting to 5 so it doesn't flood your screen)
    const notes = await apiRequest('?_limit=5', 'GET');
    
    if (notes && notes.length > 0) {
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            notesList.appendChild(noteElement);
        });
    } else if (notes) {
        notesList.innerHTML = '<li>No notes found.</li>';
    }
}

// Attach the load function to the required Load Button
loadBtn.addEventListener('click', loadNotes);

// Handle form submission to create a new note
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        updateStatus('Please fill in both the title and body.', true);
        return;
    }

    const newNoteData = {
        title: title,
        body: body,
        userId: 1 // JSONPlaceholder requires a userId
    };

    const createdNote = await apiRequest('', 'POST', newNoteData);

    if (createdNote) {
        // Safely add the new note to the top of the list
        const noteElement = createNoteElement(createdNote);
        notesList.prepend(noteElement);
        
        // Clear the form
        titleInput.value = '';
        bodyInput.value = '';
    }
});

// Delete a note
async function deleteNote(id, liElement) {
    const result = await apiRequest(`/${id}`, 'DELETE');
    
    if (result) {
        // Remove the note from the screen if the API call succeeds
        liElement.remove();
    }
}