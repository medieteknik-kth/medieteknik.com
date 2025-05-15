from pydantic import BaseModel


class VerifyPermissionDTO(BaseModel):
    path: str
    method: str
