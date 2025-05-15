import msgspec


class VerifyPermissionDTO(msgspec.Struct):
    path: str
    method: str
