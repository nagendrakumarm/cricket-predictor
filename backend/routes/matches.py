from fastapi import APIRouter
from db.supabase_rest import get, insert, update

router = APIRouter(prefix="/matches", tags=["matches"])

@router.get("")
def list_matches(tournament_id: int | None = None):
    if tournament_id:
        return get("matches", f"?tournament_id=eq.{tournament_id}&status=eq.upcoming&select=*&order=match_date.asc")
    data = get("matches", "?select=*")
    return data

@router.post("")
def create_match(match: dict):
    created = insert("matches", match)
    return created

@router.get("/latest")
def get_latest_match(tournament_id: int):
    return get("matches", f"?tournament_id=eq.{tournament_id}&status=eq.upcoming&select=*&order=match_date.asc,id.asc&limit=1")

@router.patch("/{match_id}/result")
def update_match_result(match_id: int, payload: dict):
    print(f"Updating match {match_id} with winner {payload['winner']}");
    return update("matches", f"?id=eq.{match_id}", {
        "winner": payload["winner"],
        "status": "completed"
    })