import os

RECEPTION_MODE = True if os.getenv('RECEPTION_MODE', '0') == '1' else False
