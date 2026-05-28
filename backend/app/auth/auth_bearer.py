import os
from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException
from jose import jwt, JWTError

SECRET_KEY = os.getenv("SECRET_KEY", "MY_SECRET_KEY")

ALGORITHM = "HS256"


class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials = await super().__call__(request)

        token = credentials.credentials

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM]
            )

            return payload

        except JWTError:
            raise HTTPException(
                status_code=403,
                detail="Invalid token"
            )