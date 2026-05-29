import bcrypt
import hashlib


def _pre_hash(password: str) -> str:
    """
    SHA256 first → avoids bcrypt 72-byte limit
    """
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


def hash_password(password: str) -> str:

    hashed_input = _pre_hash(password)

    hashed_password = bcrypt.hashpw(
        hashed_input.encode("utf-8"),
        bcrypt.gensalt()
    )

    return hashed_password.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    hashed_input = _pre_hash(plain_password)

    return bcrypt.checkpw(
        hashed_input.encode("utf-8"),
        hashed_password.encode("utf-8")
    )