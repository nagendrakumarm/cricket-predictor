from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from routes.tournaments import router as tournaments_router
from routes.groups import router as groups_router
from routes.teams import router as teams_router
from routes.matches import router as matches_router
from routes.standings import router as standings_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "https://nagendrakumarm.github.io"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tournaments_router)
app.include_router(groups_router)
app.include_router(teams_router)
app.include_router(matches_router)
app.include_router(standings_router)

@app.get("/")
def root():
    return {"status": "ok"}
