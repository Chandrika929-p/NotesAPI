const API_URL = "/note";
const GET_ALL_URL = "/notes";


// Add Note elements

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const addButton = document.getElementById("add-note-btn");


// Notes container

const notesContainer = document.getElementById("notes-container");


// Search elements

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const showAllButton = document.getElementById("show-all-btn");


// Edit elements

const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");

const saveEditButton =
    document.getElementById("save-edit-btn");

const cancelEditButton =
    document.getElementById("cancel-edit-btn");


// Store currently editing note

let editingNoteId = null;



// ========================================
// Display Notes
// ========================================

function displayNotes(notes) {

    notesContainer.innerHTML = "";


    if (notes.length === 0) {

        notesContainer.innerHTML = `
            <div class="empty-state">

                <h3>No Notes Found 📝</h3>

                <p>
                    Create a note or try another search.
                </p>

            </div>
        `;

        return;
    }


    notes.forEach(note => {

        const noteCard =
            document.createElement("div");

        noteCard.className = "note-card";


        noteCard.innerHTML = `

            <h3>${note.title}</h3>

            <p>${note.content}</p>

            <div class="note-actions">

                <button
                    class="edit-btn"
                    onclick="editNote(${note.id})">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteNote(${note.id})">

                    Delete

                </button>

            </div>

        `;


        notesContainer.appendChild(noteCard);

    });

}



// ========================================
// Get All Notes
// ========================================

async function getNotes() {

    notesContainer.innerHTML =
        "<p>Loading notes...</p>";


    try {

        const response =
            await fetch(GET_ALL_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load notes"
            );

        }


        const notes =
            await response.json();


        displayNotes(notes);


    } catch (error) {

        notesContainer.innerHTML = `

            <div class="empty-state">

                <h3>Something went wrong 😕</h3>

                <p>
                    Unable to load notes.
                </p>

            </div>

        `;

        console.error(error);

    }

}



// ========================================
// Add Note
// ========================================

async function addNote() {

    const title =
        titleInput.value.trim();

    const content =
        contentInput.value.trim();


    if (!title || !content) {

        alert(
            "Please enter title and content."
        );

        return;
    }


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    title: title,

                    content: content

                })

            });


        if (!response.ok) {

            throw new Error(
                "Failed to add note"
            );

        }


        titleInput.value = "";

        contentInput.value = "";


        getNotes();


    } catch (error) {

        alert(
            "Unable to add note."
        );

        console.error(error);

    }

}



// ========================================
// Delete Note
// ========================================

async function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete note"
            );

        }


        getNotes();


    } catch (error) {

        alert(
            "Unable to delete note."
        );

        console.error(error);

    }

}



// ========================================
// Open Edit Form
// ========================================

async function editNote(id) {

    editingNoteId = id;


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to get note"
            );

        }


        const note =
            await response.json();


        editTitle.value =
            note.title;

        editContent.value =
            note.content;


        editForm.style.display =
            "block";


        editForm.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        alert(
            "Unable to load note."
        );

        console.error(error);

    }

}



// ========================================
// Save Edited Note
// ========================================

saveEditButton.addEventListener(
    "click",
    async function () {

        const title =
            editTitle.value.trim();

        const content =
            editContent.value.trim();


        if (!title || !content) {

            alert(
                "Please enter title and content."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${editingNoteId}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            title: title,

                            content: content

                        })

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to update note"
                );

            }


            editForm.style.display =
                "none";


            editingNoteId = null;


            editTitle.value = "";

            editContent.value = "";


            getNotes();


        } catch (error) {

            alert(
                "Unable to update note."
            );

            console.error(error);

        }

    }
);



// ========================================
// Cancel Edit
// ========================================

cancelEditButton.addEventListener(
    "click",
    function () {

        editForm.style.display =
            "none";


        editingNoteId = null;


        editTitle.value = "";

        editContent.value = "";

    }
);



// ========================================
// Search Notes
// ========================================

async function searchNotes() {

    const title =
        searchInput.value.trim();


    if (!title) {

        getNotes();

        return;
    }


    try {

        const response =
            await fetch(
                `/note?title=${encodeURIComponent(title)}`
            );


        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }


        const notes =
            await response.json();


        displayNotes(notes);


    } catch (error) {

        console.error(error);

        alert(
            "Unable to search notes."
        );

    }

}



// ========================================
// Event Listeners
// ========================================

addButton.addEventListener(
    "click",
    addNote
);


searchButton.addEventListener(
    "click",
    searchNotes
);


showAllButton.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        getNotes();

    }
);



// ========================================
// Load Notes When Page Opens
// ========================================

getNotes();