"""
RGBank routes
==========
"""

from .auth.account_routes import router as account_router
from .auth.expense_domain_routes import router as expense_domain_router
from .auth.expense_routes import router as expense_router
from .auth.invoice_routes import router as invoice_router
from .auth.permission_routes import router as rgbank_permissions_router
from .auth.statistics_routes import router as statistics_router
from .public.expense_domain_routes import router as public_expense_domain_router
from .public.statistics_routes import router as public_statistics_router

__all__ = [
    "account_router",
    "public_expense_domain_router",
    "expense_domain_router",
    "expense_router",
    "invoice_router",
    "rgbank_permissions_router",
    "statistics_router",
    "public_statistics_router",
]
