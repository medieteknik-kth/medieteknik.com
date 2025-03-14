"""
Utility functions for logging.
"""

import inspect
from logging import Logger
from flask import current_app


def get_logger() -> Logger:
    """
    Get the logger for the application.
    """
    return current_app.logger


def log_error(message: str, **kwargs) -> None:
    """
    Log an error message.
    """

    frame = inspect.stack()[1]

    extra = {
        "caller_module": inspect.getmodule(frame[0]).__name__,
        "caller_function": frame.function,
        "caller_lineno": frame.lineno,
        **kwargs,
    }

    get_logger().error(f"{message}", extra=extra)


def log_warning(message: str, **kwargs) -> None:
    """
    Log a warning message.
    """
    frame = inspect.stack()[1]

    extra = {
        "caller_module": inspect.getmodule(frame[0]).__name__,
        "caller_function": frame.function,
        "caller_lineno": frame.lineno,
        **kwargs,
    }

    get_logger().warning(f"{message}", extra=extra)


def log_info(message: str, **kwargs) -> None:
    """
    Log an information message.
    """
    frame = inspect.stack()[1]

    extra = {
        "caller_module": inspect.getmodule(frame[0]).__name__,
        "caller_function": frame.function,
        "caller_lineno": frame.lineno,
        **kwargs,
    }

    get_logger().info(f"{message}", extra=extra)
