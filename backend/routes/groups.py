from fastapi import APIRouter
from models.groups import Group
from db.supabase_rest import get, insert

router = APIRouter(prefix="/groups", tags=["groups"])

@router.get("/")
def list_groups():
    data = get("groups", "?select=*")
    return data

@router.post("/")
def create_group(group: Group):
    created = insert("groups", group.dict())
    return created

@router.get("/{group_id}")
def get_group(group_id: int):
    data = get("groups", f"?id=eq.{group_id}&select=*")
    return data
