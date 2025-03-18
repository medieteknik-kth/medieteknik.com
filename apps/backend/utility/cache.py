import sqlite3
import os

os.makedirs("cache", exist_ok=True)

CACHE_DB_PATH = "cache/cache.db"


def _create_table():
    with sqlite3.connect(CACHE_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)"
        )
        conn.commit()


# Initialize the cache table
_create_table()


def get_cache(key: str) -> str | None:
    try:
        with sqlite3.connect("cache/cache.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM cache WHERE key = ?", (key,))
            result = cursor.fetchone()
            if not result:
                return None
            return result[0]

    except sqlite3.Error as e:
        raise Exception(f"Cache retrieval error: {str(e)}")


def set_cache(key: str, value: str):
    try:
        with sqlite3.connect("cache/cache.db") as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)", (key, value)
            )
            conn.commit()
    except sqlite3.Error as e:
        raise Exception(f"Cache storage error: {str(e)}")
