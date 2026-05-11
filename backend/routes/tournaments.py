from fastapi import APIRouter
from models.tournament import Tournament
from db.supabase_rest import get, insert

router = APIRouter(prefix="/tournaments", tags=["tournaments"])

@router.get("/")
def list_tournaments():
    # order by year desc
    data = get("tournaments", "?select=*&order=year.desc")
    return data

@router.post("/")
def create_tournament(tournament: Tournament):
    # expect Angular to send full object
    created = insert("tournaments", tournament.dict())
    return created
