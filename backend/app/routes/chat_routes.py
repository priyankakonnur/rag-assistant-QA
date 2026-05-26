from fastapi import APIRouter, Depends
from app.auth.auth_bearer import JWTBearer
from app.repositories.chat_repository import get_user_chats

router = APIRouter(tags=["Chats"])


@router.get("/chats")
def fetch_chats(
    user=Depends(JWTBearer())
):
    chats = get_user_chats(
        user["email"]
    )

    for chat in chats:
        chat["_id"] = str(chat["_id"])

    return chats