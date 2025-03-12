const notesContainer = document.querySelector("#notes-section .cards");



async function fetchNotes() {
  try {
    const res = await fetch("http://localhost:5001/api/notes");
    const notes = await res.json();

    notesContainer.innerHTML = ""; // Clear existing notes

    notes.forEach((note) => {
      const noteCard = `
        <div class="card">
          <h1>${note.title}</h1>
          <p>${note.content}</p>
          ${note.videoUrl ? `<a href="${note.videoUrl}" target="_blank">Watch Video</a>` : ""}
          ${note.pdfFile ? `<a href="http://localhost:5001/${note.pdfFile}" target="_blank">📄 Download PDF</a>` : ""}

          <button onclick="deleteNote('${note._id}')">❌ Delete</button>
        </div>
      `;
      notesContainer.innerHTML += noteCard;
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

async function deleteNote(id) {
  try {
    const res = await fetch(`http://localhost:5001/api/notes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchNotes(); // Refresh after delete
    }
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

fetchNotes(); // Call on load
const noteForm = document.getElementById("note-form");

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("note-title").value);
  formData.append("content", document.getElementById("note-content").value);
  formData.append("videoUrl", document.getElementById("note-video-url").value);
  formData.append("pdfFile", document.getElementById("note-pdf").files[0]);

  try {
    const res = await fetch("http://localhost:5001/api/notes/add", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Note added successfully!");
      fetchNotes(); // Refresh notes after adding
      noteForm.reset(); // Clear form
    } else {
      alert("❌ Failed to add note");
    }
  } catch (error) {
    console.error("Error adding note:", error);
  }
});
