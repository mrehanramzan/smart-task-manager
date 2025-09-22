from pydantic import BaseModel


class SubscriptionUpdateRequest(BaseModel):
    tier: str 