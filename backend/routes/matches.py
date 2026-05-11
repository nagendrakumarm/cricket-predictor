from fastapi import APIRouter
from db.supabase_rest import get, insert

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
