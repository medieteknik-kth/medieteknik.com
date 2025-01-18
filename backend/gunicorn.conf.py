"""
Gunicorn configuration for the deployment.
"""

import multiprocessing
import os
from dotenv import load_dotenv

loglevel = os.environ.get("LOG_LEVEL", "info")
workers = multiprocessing.cpu_count() + 1
bind = "0.0.0.0:80"
timeout = 120

env = os.path.join(os.getcwd(), ".env")
if os.path.exists(env):
    load_dotenv(env)
