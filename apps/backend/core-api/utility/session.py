from fastapi import Request, Response
from itsdangerous import URLSafeSerializer

from config import Settings

serializer = URLSafeSerializer(Settings.SECRET_KEY)


def get_session_data(request: Request) -> dict:
    cookie = request.cookies.get(Settings.SESSION_COOKIE_NAME)
    if not cookie:
        return {}
    try:
        return serializer.loads(cookie)
    except Exception:
        return {}


def set_session_data(response: Response, data: dict):
    response.set_cookie(
        key=Settings.SESSION_COOKIE_NAME,
        value=serializer.dumps(data),
        httponly=True,
        expires="session",
        secure=Settings.ENV == "production",
        samesite="lax",
    )


class CookieSession:
    """
    A utility class for managing ephemeral session data stored in cookies.
    This class provides a convenient interface for accessing and manipulating
    session data that is stored in HTTP cookies. It handles the retrieval,
    modification, and persistence of session data.
    Args:
        request (Request): The HTTP request object containing the session cookies.
    Attributes:
        _data (dict): The session data retrieved from cookies.
    Methods:
        get: Retrieves a value from the session data.
        set: Sets a value in the session data.
        delete: Removes a key from the session data.
        save: Persists the session data to the response cookies.
    Example:
        ```
        session = CookieSession(request)
        user_id = session.get('user_id')
        session.set('last_visit', datetime.now())
        session.save(response)
        ```
    """

    def __init__(self, request: Request):
        self._data = get_session_data(request)

    def get(self, key: str, default=None):
        return self._data.get(key, default)

    def set(self, key: str, value):
        self._data[key] = value

    def delete(self, key: str):
        if key in self._data:
            del self._data[key]

    def save(self, response: Response):
        set_session_data(response, self._data)
