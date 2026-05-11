from fastapi import APIRouter
from db.supabase_rest import get, insert

router = APIRouter(prefix="/standings", tags=["standings"])

@router.get("/{tournament_id}")
def get_standings(tournament_id: int):
    return get(
        "standings",
        f"?tournament_id=eq.{tournament_id}&select=*,team:teams(name)"
    )
