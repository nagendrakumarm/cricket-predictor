import os
from dotenv import load_dotenv
import requests

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_KEY not set in .env")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def get(table: str, query: str = ""):
    url = f"{SUPABASE_URL}/{table}{query}"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json() if resp.text else {}

def insert(table: str, payload: dict | list[dict]):
    url = f"{SUPABASE_URL}/{table}"
    resp = requests.post(url, headers=HEADERS, json=payload)
    print("STATUS:", resp.status_code)
    print("BODY:", resp.text)
    resp.raise_for_status()
    return resp.json() if resp.text else {}

def update(table: str, query: str, payload: dict):
    url = f"{SUPABASE_URL}/{table}{query}"
    resp = requests.patch(url, headers=HEADERS, json=payload)
    resp.raise_for_status()
    return resp.json() if resp.text else {}

def delete(table: str, query: str):
    url = f"{SUPABASE_URL}/{table}{query}"
    resp = requests.delete(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json() if resp.text else {}
