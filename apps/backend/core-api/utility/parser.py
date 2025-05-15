from http import HTTPStatus
from typing import Any, TypeVar

import msgspec
from fastapi import HTTPException

T = TypeVar("T")


def validate_json(body_bytes: bytes, model_type: T) -> T:
    """
    Validates a JSON payload against a specified model type.

    This function attempts to decode and validate a JSON payload using the msgspec library. If the
    payload does not match the expected model type's structure, a validation error is raised.

    Args:
        body_bytes (bytes): The raw JSON payload as bytes.
        model_type: The model type to validate the JSON against. Should be a msgspec-compatible type.

    Returns:
        The decoded JSON data as an instance of the specified model_type.

    Raises:
        HTTPException: If the JSON payload fails validation, a 422 Unprocessable Entity error is raised
            with the validation error details.
    """
    try:
        return msgspec.json.decode(body_bytes, type=model_type)
    except msgspec.ValidationError as e:
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY, detail=str(e))


def validate_form_to_msgspec(form_data: dict, model_type: T) -> T:
    """
    Validates and converts form data to a msgspec model.
    This function takes form data as a dictionary and converts it to a specified msgspec model type.
    It first encodes the data to JSON and then decodes it to the target model type, which
    ensures validation of the data against the model's schema.

    Args:
        form_data (dict): A dictionary containing form data to be validated and converted.
        model_type: The msgspec model type to convert the form data to.
    Returns:
        The form data converted to the specified msgspec model type.
    Raises:
        HTTPException: If the form data fails validation against the model type,
            an HTTPException with status code 422 (UNPROCESSABLE_ENTITY) is raised
            containing the validation error message.
    """
    data_dict = {k: v for k, v in form_data.items()}

    try:
        json_data = msgspec.json.encode(data_dict)
        return msgspec.json.decode(json_data, type=model_type)
    except msgspec.ValidationError as e:
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY, detail=str(e))


async def parse_body(request: Any, model_type: T) -> T:
    """
    Asynchronously parses the request body into the specified model type.

    This function reads the request body as bytes and validates it against
    the provided model type using the validate_json function.

    Args:
        request (Any): The request object containing the body to parse.
        model_type: The model class to validate and convert the JSON data into.

    Returns:
        An instance of the specified model_type containing the parsed data.

    Raises:
        Any exceptions raised by the validate_json function.
    """
    body_bytes = await request.body()
    return validate_json(body_bytes, model_type)
