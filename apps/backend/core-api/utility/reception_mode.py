"""
Utility for checking if the server is running in reception mode.
"""

import os

# The reception mode flag, indicating if the server is running in reception mode used for students details.
RECEPTION_MODE = True if os.environ.get("RECEPTION_MODE") == "1" else False
