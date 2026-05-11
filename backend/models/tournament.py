from pydantic import BaseModel

class Tournament(BaseModel):
    name: str
    year: int | None = None
    location: str | None = None
    def __str__(self):
        return f"{self.name} ({self.year})" 
    