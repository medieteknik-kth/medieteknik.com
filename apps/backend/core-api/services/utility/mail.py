"""
Mail service for sending emails using Mailgun API.
"""

import json

import requests

from config import Settings
from models.apps.rgbank import Expense, Invoice


def send_expense_message(
    expense_item: Expense | Invoice,
    subject: str = "Expense",
):
    """
    Send an email with the expense item details using Mailgun API.

    Args:
        expense_item (Expense | Invoice): The expense item to send.
        subject (str): The subject of the email. Defaults to "Expense".
    """
    api_key = Settings.MAILGUN_API_KEY
    email = Settings.MAILGUN_EMAIL

    if not api_key:
        raise ValueError("MAILGUN_API_KEY is not set in the environment variables.")

    if not email:
        raise ValueError("MAILGUN_EMAIL is not set in the environment variables.")

    name = expense_item.title
    item_type = "utgift" if isinstance(expense_item, Expense) else "faktura"
    expense_author_name = (
        (expense_item.student.to_dict())["first_name"]
        + " "
        + (expense_item.student.to_dict())["last_name"]
    )

    expense_author_email = (expense_item.student.to_dict())["email"]

    return requests.post(
        "https://api.eu.mailgun.net/v3/mail.medieteknik.com/messages",
        auth=("api", api_key),
        data={
            "from": "Medieteknik <noreply@mail.medieteknik.com>",
            "to": email,
            "subject": subject,
            "template": "invoice",
            "t:variables": json.dumps(
                {
                    "expense_type": item_type,
                    "expense_name": str(name),
                    "expense_author": expense_author_name,
                    "expense_author_email": expense_author_email,
                    "expense_total": expense_item.amount,
                }
            ),
        },
    )
