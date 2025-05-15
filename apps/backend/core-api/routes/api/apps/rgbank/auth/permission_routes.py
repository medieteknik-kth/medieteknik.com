from http import HTTPStatus

from fastapi import APIRouter, Cookie, Request, Response

from config import Settings
from decorators import nextjs_auth_required
from dto.apps.rgbank.permissions import VerifyPermissionDTO
from models.apps.rgbank import RGBankViewPermissions
from routes.api.deps import SessionDep
from utility.jwt import decode_jwt
from utility.parser import parse_body

routes_mapping = [
    {
        "pattern": "/admin",
        "view_permissions": [
            RGBankViewPermissions.OWN_COMMITTEE,
            RGBankViewPermissions.ALL_COMMITTEES,
        ],
    },
]

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/permissions",
    tags=["RGBank", "Permissions"],
    dependencies=[nextjs_auth_required],
)


@router.post("/")
async def get_all_rgbank_permissions(
    session: SessionDep,
    request: Request,
    jwt_cookie: str | None = Cookie(..., alias=Settings.JWT_COOKIE_NAME),
):
    if not jwt_cookie:
        return {"message": "No permissions found"}, HTTPStatus.FORBIDDEN

    validated_data = await parse_body(request=request, model_type=VerifyPermissionDTO)

    path: str = validated_data.path
    method: str = validated_data.method
    jwt_token = decode_jwt(token=jwt_cookie, session=session)

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
