import os
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = os.getenv("SECRET_KEY", "MY_SECRET_KEY")

ALGORITHM = "HS256"

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(hours=24)

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token