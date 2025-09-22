from pydantic import BaseModel

class UpdateProfileRequest(BaseModel):
    fullname: str | None = None
    email: str | None = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str