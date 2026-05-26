from app.repositories.user_repository import (
    create_user,
    get_user_by_email
)

from app.auth.password_handler import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)

def register_user(user):

    existing_user = get_user_by_email(
        user.email
    )

    if existing_user:

        return {
            "error": "User already exists"
        }

    hashed_password = hash_password(
        user.password
    )

    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }

    create_user(user_data)

    return {
        "message": "User registered successfully"
    }


def login_user(user):

    existing_user = get_user_by_email(
        user.email
    )

    if not existing_user:

        return {
            "error": "Invalid email"
        }

    valid_password = verify_password(
        user.password,
        existing_user["password"]
    )

    if not valid_password:

        return {
            "error": "Invalid password"
        }

    token = create_access_token({
        "email": user.email
    })

    return {
        "access_token": token
    }