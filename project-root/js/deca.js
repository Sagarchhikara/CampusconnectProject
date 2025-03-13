const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : 'https://your-production-api.com/api'; // Change to your production API URL

// 🌟 Toggle navigation menu
const nav_list = document.getElementById('nav-list');
const openMenu = document.querySelector('.menuopen');
const cross = document.querySelector('.cross');

openMenu.addEventListener('click', () => {
    nav_list.style.opacity = '100%';
    openMenu.style.display = 'none';
});

cross.addEventListener('click', () => {
    nav_list.style.opacity = '0%';
    setTimeout(() => {
        openMenu.style.display = 'block';
    }, 400);
});

// 🌟 Handle login form (Optional)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Add login logic here
        console.log('Login attempt:', username);
        alert('Login functionality will be implemented soon.');

        this.reset();
    });
}

// 🌟 Fetch and display notes
async function fetchNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/notes`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const notes = await response.json();
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = ""; // Clear existing notes

        if (notes.length === 0) {
            notesContainer.innerHTML = "<p>No notes found. Add your first note!</p>";
            return;
        }

        notes.forEach((note) => {
            let noteElement = document.createElement("div");
            noteElement.className = "note";
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                ${
                    note.pdfFile
                        ? `<a href="${API_BASE_URL}/pdf/${note.pdfFile.split('/').pop()}" target="_blank">
                            📄 View PDF
                          </a>`
                        : ""
                }
                <button onclick="deleteNote('${note._id}')">Delete</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        document.getElementById("notes-container").innerHTML = 
            `<p>Unable to load notes. Please check your connection or try again later.</p>
             <p>Error: ${error.message}</p>`;
    }
}

// 🌟 Add a new note with PDF
const noteForm = document.getElementById('note-form');
if (noteForm) {
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById("note-title").value;
        const content = document.getElementById("note-content").value;
        const pdfFile = document.getElementById("note-pdf").files[0];

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (pdfFile) {
            formData.append("pdfFile", pdfFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/notes/add`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("✅ Note added successfully!");
                noteForm.reset(); // Clear form
                fetchNotes(); // Refresh notes list
            } else {
                throw new Error(`Failed to add note. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error adding note:", error);
            alert(`Failed to add note: ${error.message}`);
        }
    });
}

// 🌟 Delete a note
async function deleteNote(noteId) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("✅ Note deleted successfully!");
            fetchNotes(); // Refresh list after deletion
        } else {
            throw new Error(`Failed to delete note. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting note:", error);
        alert(`Failed to delete note: ${error.message}`);
    }
}

// 🌟 Initialize
document.addEventListener("DOMContentLoaded", fetchNotes);
