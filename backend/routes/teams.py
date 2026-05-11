from fastapi import APIRouter
from db.supabase_rest import get, insert, update

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

@router.patch("/{team_id}/nrr")
def update_team_nrr(team_id: int, payload: dict):
    print(f"Updating team {team_id} with Played {payload['played']}, Won {payload['won']}, Lost {payload['lost']}, NRR {payload['nrr']}, Points {payload['points']}");
    return update("teams", f"?id=eq.{team_id}", {
        "nrr": payload["nrr"],
        "played": payload["played"],
        "won": payload["won"],
        "lost": payload["lost"],
        "points": payload["points"]
    })