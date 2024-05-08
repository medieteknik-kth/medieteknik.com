import multiprocessing
import os
from dotenv import load_dotenv
loglevel = "info"
workers = 3
bind = "0.0.0.0:5000"

env = os.path.join(os.getcwd(), '.env')
if os.path.exists(env):
    load_dotenv(env)