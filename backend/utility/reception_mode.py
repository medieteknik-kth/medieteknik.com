import os

RECEPTION_MODE = True if os.environ.get('RECEPTION_MODE') == 'True' else False