from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def _pre_hash(password: str) -> str:
    """
    bcrypt only supports 72 bytes.
    Convert password into SHA256 first.
    """
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


def hash_password(password: str) -> str:

    hashed_input = _pre_hash(password)

    return pwd_context.hash(hashed_input)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    hashed_input = _pre_hash(plain_password)

    return pwd_context.verify(
        hashed_input,
        hashed_password
    )