from fastapi import APIRouter
from db.supabase_rest import get, insert

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/")
@router.get("")
def list_teams(tournament_id: int | None = None):
    if tournament_id:
        return get("teams", f"?tournament_id=eq.{tournament_id}&select=*&order=points.desc,nrr.desc")
    return get("teams", "?select=*")

def get_teams_by_tournament(tournament_id: int):
    data = get("teams", f"?tournament_id=eq.{tournament_id}&select=*&order=points.desc,nrr.desc")
    return data

@router.post("/")
def create_team(team: dict):
    created = insert("teams", team)
    return created
