from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

import shutil

from app.auth.auth_bearer import JWTBearer

from app.services.rag_service import (
    process_document,
    ask_question
)

router = APIRouter(
    tags=["RAG"]
)

UPLOAD_DIR = "uploads"

@router.post("/upload")

async def upload_pdf(
    file: UploadFile = File(...),
    user = Depends(JWTBearer())
):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    result = process_document(file_path)

    return {
        "message": result
    }


# @router.get("/ask")

# def ask(
#     query: str,
#     user = Depends(JWTBearer())
# ):

#     answer = ask_question(query)

#     return {
#         "answer": answer
#     }

@router.get("/ask")

def ask(
    query: str,
    user = Depends(JWTBearer())
):

    answer = ask_question(
        query,
        user["email"]
    )

    return {
        "answer": answer
    }