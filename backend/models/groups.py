from pydantic import BaseModel

class Group(BaseModel):
    name: str
    tournament_id: int
    def __str__(self):
        return f"{self.name} (Tournament ID: {self.tournament_id})"     