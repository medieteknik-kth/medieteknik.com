"""
Package for decorators.
  :decorator csrf_protected: Decorator to protect a view from CSRF attacks.
"""

from .csrf_protection import csrf_protected

__all__ = ["csrf_protected"]
