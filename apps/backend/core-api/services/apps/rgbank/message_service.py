from models.apps.rgbank.expense import PaymentStatus
from models.apps.rgbank.thread import Message, MessageType, Thread
from utility import db


def add_message(
    thread_id: str | None,
    sender_id: str | None,
    message_text: str,
    type: MessageType = MessageType.STUDENT,
    create_thread_if_not_exists: bool = False,
    invoice_id: str | None = None,
    expense_id: str | None = None,
    previous_status: PaymentStatus | None = None,
    new_status: PaymentStatus | None = None,
) -> Message:
    """
    Adds a new message to a thread.

    Args:
        thread_id (str): The ID of the thread to which the message will be added.
        sender_id (str): The ID of the user sending the message.
        message_text (str): The content of the message.

    Returns:
        Message: The newly created message object.
    """
    if not sender_id and not type:
        raise ValueError("Either sender_id or type must be provided.")

    if not sender_id and type == MessageType.STUDENT:
        raise ValueError("sender_id must be provided if type is STUDENT.")

    if expense_id and invoice_id:
        raise ValueError("Only one of expense_id or invoice_id should be provided.")

    if not expense_id and not invoice_id:
        raise ValueError("Either expense_id or invoice_id must be provided.")

    thread = Thread.query.filter_by(thread_id=thread_id).first()
    current_thread_id = thread_id

    if create_thread_if_not_exists:
        # Check if the thread exists, if not create it
        if not thread:
            thread = Thread(
                thread_id=thread_id, invoice_id=invoice_id, expense_id=expense_id
            )
            db.session.add(thread)
            db.session.commit()

        current_thread_id = thread.thread_id
    else:
        if not thread:
            raise ValueError(f"Thread with ID {thread_id} does not exist.")

    new_message = Message(
        thread_id=current_thread_id,
        sender_id=sender_id,
        message_type=type,
        content=message_text,
        previous_status=previous_status,
        new_status=new_status,
    )

    db.session.add(new_message)
    db.session.commit()
    return new_message
