"""
Utility for checking if the server is running in reception mode.
"""

import os

RECEPTION_MODE = True if os.environ.get("RECEPTION_MODE") == "True" else False
