from http import HTTPStatus
from flask import Blueprint, Response, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from decorators import nextjs_auth_required
from models.apps.rgbank import RGBankViewPermissions


rgbank_permissions_bp = Blueprint("rgbank_permissions", __name__)

routes_mapping = [
    {
        "pattern": "/admin",
        "view_permissions": [
            RGBankViewPermissions.OWN_COMMITTEE,
            RGBankViewPermissions.ALL_COMMITTEES,
        ],
    },
]


@rgbank_permissions_bp.route("", methods=["POST"])
@nextjs_auth_required
def get_all_rgbank_permissions() -> Response:
    data = request.get_json()

    token_exists = verify_jwt_in_request(optional=True)
    if not token_exists:
        return {"message": "No permissions found"}, HTTPStatus.FORBIDDEN

    path: str = data.get("path")
    method: str = data.get("method")
    jwt_token = get_jwt()

    if not path or not method:
        return {"message": "Path and method are required"}, HTTPStatus.BAD_REQUEST

    found = False

    for route in routes_mapping:
        if path not in route["pattern"]:
            continue

        found = True

        if not jwt_token:
            return {"message": "No permissions found"}, HTTPStatus.FORBIDDEN

        rgbank_permissions = jwt_token.get("rgbank_permissions", {})

        if not rgbank_permissions:
            return {"message": "No permissions found"}, HTTPStatus.FORBIDDEN

        if (
            rgbank_permissions.get("view_permission_level")
            not in route["view_permissions"]
        ):
            return {"message": "Permission denied"}, HTTPStatus.FORBIDDEN

    if not found:
        # Let the middleware handle the request if the path is not found in the routes mapping
        # For routes that just require authentication and not any specific permissions
        return {"message": "Path not found"}, HTTPStatus.NOT_FOUND

    return Response(status=HTTPStatus.NO_CONTENT)
