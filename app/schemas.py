from pydantic import BaseModel, Field

class HouseFeatures(BaseModel):
    Area_Marla: float = Field(gt=0)
    Bedrooms: int = Field(gt=0)
    Bathrooms: int = Field(gt=0)
    Built_Year: int = Field(ge=1950, le=2026)
    Kitchens: int = Field(gt=0)
    Store_Rooms: int = Field(ge=0)
    Servant_Quarters: int = Field(ge=0)
    Location: str