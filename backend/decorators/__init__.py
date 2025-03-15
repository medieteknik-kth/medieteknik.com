"""
Package for decorators.
  :decorator csrf_protected: Decorator to protect a view from CSRF attacks.
  :decorator verify_google_oidc_token: Decorator to verify a Google OIDC token e.g. from GCP Scheduler or Pub/Sub.
"""

from .csrf_protection import csrf_protected
from .google_oidc import verify_google_oidc_token

__all__ = ["csrf_protected", "verify_google_oidc_token"]
