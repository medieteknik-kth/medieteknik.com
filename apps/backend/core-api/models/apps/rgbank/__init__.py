"""
RGBank App Models
=================

This module contains the models for the RGBank app, which is part of the

Models:
 - AccountBankInformation: Model representing bank account information for students.
 - ExpenseDomain: Model representing the domain of expenses, i.e. which committee is responsible for which expense.
 - Expense: Model representing an expense submitted by a student.
 - Invoice: Model representing an invoice related to an expense.
 - Thread: Model representing a thread of messages related to an expense or invoice.
 - Message: Model representing a message in a thread. Basically comments.
"""

from .bank import AccountBankInformation

from .expense import ExpenseDomain
from .expense import Expense
from .expense import Invoice
from .expense import PaymentStatus
from .expense import BookedItem

from .permissions import RGBankAccessLevels
from .permissions import RGBankPermissions
from .permissions import RGBankViewPermissions

from .statistics import Statistics
from .statistics import ExpenseCount

from .thread import Thread
from .thread import Message
from .thread import MessageType

__all__ = [
    "AccountBankInformation",
    "ExpenseDomain",
    "Expense",
    "Invoice",
    "PaymentStatus",
    "BookedItem",
    "RGBankAccessLevels",
    "RGBankPermissions",
    "RGBankViewPermissions",
    "Statistics",
    "ExpenseCount",
    "Thread",
    "Message",
    "MessageType",
]
