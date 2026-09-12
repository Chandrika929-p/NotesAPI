from fastapi import HTTPException
from models import Note

def create_note(db,note):
    new_note = Note(
        title=note.title,
        content=note.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

def get_all_notes(db):
    note = db.query(Note).all()
    return note

def get_note_by_id(db,note_id):
    note = db.query(Note).filter(Note.id == note_id).first()
    return note

def get_note_by_title(title,db):
    note = db.query(Note).filter(Note.title == title).all()
    return note

def update_note(db,note_id,update):
    existing_note = db.query(Note).filter(Note.id == note_id).first()

    if existing_note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    if update.title is not None:
        existing_note.title = update.title
    if update.content is not None:
        existing_note.content = update.content

    db.commit()
    db.refresh(existing_note)
    return existing_note


def delete_note(db,note_id):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    db.delete(note)
    db.commit()


