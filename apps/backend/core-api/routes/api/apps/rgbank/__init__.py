"""
RGBank routes
==========
"""

from .auth.account_routes import account_bp

from .auth.expense_domain_routes import expense_domain_bp
from .public.expense_domain_routes import public_expense_domain_bp

from .auth.expense_routes import expense_bp

from .auth.invoice_routes import invoice_bp

from .auth.permission_routes import rgbank_permissions_bp

from .auth.statistics_routes import statistics_bp
from .public.statistics_routes import public_statistics_bp


__all__ = [
    "account_bp",
    "expense_domain_bp",
    "public_expense_domain_bp",
    "expense_bp",
    "invoice_bp",
    "rgbank_permissions_bp",
    "statistics_bp",
    "public_statistics_bp",
]
