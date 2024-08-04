"""
Package for decorators.

Decorators:
  - csrf_protected
"""

from .csrf_protection import csrf_protected

__all__ = ["csrf_protected"]
