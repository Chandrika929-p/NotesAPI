import models
import crud
import schema
from database import engine, get_db
from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


@app.post("/note",status_code=201)
def create_note(note: schema.NoteCreate, db:Session=Depends(get_db)):
    result = crud.create_note(db, note)
    return {"note":result}

@app.get("/notes",status_code=200)
def get_all_notes(db:Session=Depends(get_db)):
    result = crud.get_all_notes(db)
    return result

@app.get("/note/{note_id}",status_code=200)
def get_note_by_id(note_id: int,db:Session=Depends(get_db)):
    result = crud.get_note_by_id(db, note_id)
    return result

@app.get("/note",status_code=200)
def get_note_by_title(title: str,db:Session=Depends(get_db)):
    result = crud.get_note_by_title(title,db)
    return result


@app.put("/note/{note_id}",status_code=200)
def update_note(note_id:int,update: schema.NoteUpdate,db:Session=Depends(get_db) ):
    result = crud.update_note(db, note_id,update)
    return result

@app.patch("/note/{note_id}",status_code=200)
def patch_note(note_id:int,update:schema.NoteUpdate,db:Session=Depends(get_db)):
    result = crud.update_note(db, note_id,update)
    return result


@app.delete("/note/{note_id}",status_code=200)
def delete_note(note_id: int,db:Session=Depends(get_db)):
    crud.delete_note(db, note_id)
    return {"message":"Note deleted successfully"}