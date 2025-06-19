import json
import os

import requests

from models.apps.rgbank import Expense, Invoice


def send_expense_message(
    expense_item: Expense | Invoice,
    subject: str = "Expense",
):
    api_key = os.getenv("MAILGUN_API_KEY")
    email = os.getenv("MAILGUN_EMAIL")

    if not api_key:
        raise ValueError("MAILGUN_API_KEY is not set in the environment variables.")

    if not email:
        raise ValueError("MAILGUN_EMAIL is not set in the environment variables.")

    name = expense_item.title
    item_type = "utgift" if isinstance(expense_item, Expense) else "faktura"
    expense_author_name = (
        (expense_item.student.to_dict(is_public_route=False))["first_name"]
        + " "
        + (expense_item.student.to_dict(is_public_route=False))["last_name"]
    )

    expense_author_email = (expense_item.student.to_dict(is_public_route=False))[
        "email"
    ]

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
