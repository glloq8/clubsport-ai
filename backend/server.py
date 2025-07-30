from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum
import os
import uuid

# Initialize FastAPI app
app = FastAPI(title="Sports Club API", description="API for Sports Club Management")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.sports_club

# Collections
teams_collection = db.teams
players_collection = db.players
matches_collection = db.matches
events_collection = db.events
news_collection = db.news
sponsors_collection = db.sponsors

# Enums
class SportType(str, Enum):
    FOOTBALL = "football"
    BASKETBALL = "basketball"
    VOLLEYBALL = "volleyball"
    TENNIS = "tennis"
    HOCKEY = "hockey"

class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class EventType(str, Enum):
    MATCH = "match"
    TRAINING = "training"
    TOURNAMENT = "tournament"
    MEETING = "meeting"
    SOCIAL = "social"

# Pydantic Models
class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    sport: SportType
    category: str  # e.g., "Senior", "Junior", "Youth"
    description: str
    image: Optional[str] = None
    founded_year: Optional[int] = None
    coach: Optional[str] = None
    home_venue: Optional[str] = None
    achievements: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)

class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    team_id: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    age: Optional[int] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    stats: Dict[str, Any] = {}
    achievements: List[str] = []
    joined_date: Optional[date] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class Match(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    home_team_id: str
    away_team_id: str
    home_team_name: str
    away_team_name: str
    match_date: datetime
    venue: str
    sport: SportType
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: MatchStatus = MatchStatus.SCHEDULED
    match_report: Optional[str] = None
    season: Optional[str] = None
    competition: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: datetime
    end_date: Optional[datetime] = None
    location: str
    event_type: EventType
    organizer: Optional[str] = None
    max_participants: Optional[int] = None
    current_participants: int = 0
    is_public: bool = True
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    summary: str
    author: str
    category: str
    image: Optional[str] = None
    tags: List[str] = []
    published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Sponsor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    sponsorship_level: str  # "Gold", "Silver", "Bronze", etc.
    description: Optional[str] = None
    active: bool = True
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.now)

# Teams endpoints
@app.get("/api/teams", response_model=List[Team])
async def get_teams():
    teams = []
    async for team in teams_collection.find():
        teams.append(Team(**team))
    return teams

@app.post("/api/teams", response_model=Team)
async def create_team(team: Team):
    team_dict = team.dict()
    await teams_collection.insert_one(team_dict)
    return team

@app.get("/api/teams/{team_id}", response_model=Team)
async def get_team(team_id: str):
    team = await teams_collection.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return Team(**team)

@app.put("/api/teams/{team_id}", response_model=Team)
async def update_team(team_id: str, team: Team):
    team_dict = team.dict()
    result = await teams_collection.update_one({"id": team_id}, {"$set": team_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@app.delete("/api/teams/{team_id}")
async def delete_team(team_id: str):
    result = await teams_collection.delete_one({"id": team_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"message": "Team deleted successfully"}

# Players endpoints
@app.get("/api/players", response_model=List[Player])
async def get_players(team_id: Optional[str] = None):
    query = {"team_id": team_id} if team_id else {}
    players = []
    async for player in players_collection.find(query):
        players.append(Player(**player))
    return players

@app.post("/api/players", response_model=Player)
async def create_player(player: Player):
    player_dict = player.dict()
    await players_collection.insert_one(player_dict)
    return player

@app.get("/api/players/{player_id}", response_model=Player)
async def get_player(player_id: str):
    player = await players_collection.find_one({"id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return Player(**player)

@app.put("/api/players/{player_id}", response_model=Player)
async def update_player(player_id: str, player: Player):
    player_dict = player.dict()
    result = await players_collection.update_one({"id": player_id}, {"$set": player_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

# Matches endpoints
@app.get("/api/matches", response_model=List[Match])
async def get_matches(limit: int = 50):
    matches = []
    async for match in matches_collection.find().sort("match_date", -1).limit(limit):
        matches.append(Match(**match))
    return matches

@app.post("/api/matches", response_model=Match)
async def create_match(match: Match):
    match_dict = match.dict()
    await matches_collection.insert_one(match_dict)
    return match

@app.get("/api/matches/{match_id}", response_model=Match)
async def get_match(match_id: str):
    match = await matches_collection.find_one({"id": match_id})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return Match(**match)

@app.put("/api/matches/{match_id}", response_model=Match)
async def update_match(match_id: str, match: Match):
    match_dict = match.dict()
    result = await matches_collection.update_one({"id": match_id}, {"$set": match_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

# Events endpoints
@app.get("/api/events", response_model=List[Event])
async def get_events(limit: int = 20):
    events = []
    async for event in events_collection.find().sort("event_date", 1).limit(limit):
        events.append(Event(**event))
    return events

@app.post("/api/events", response_model=Event)
async def create_event(event: Event):
    event_dict = event.dict()
    await events_collection.insert_one(event_dict)
    return event

# News endpoints
@app.get("/api/news", response_model=List[NewsArticle])
async def get_news(published_only: bool = True, limit: int = 10):
    query = {"published": True} if published_only else {}
    news = []
    async for article in news_collection.find(query).sort("created_at", -1).limit(limit):
        news.append(NewsArticle(**article))
    return news

@app.post("/api/news", response_model=NewsArticle)
async def create_news(article: NewsArticle):
    article_dict = article.dict()
    await news_collection.insert_one(article_dict)
    return article

# Sponsors endpoints
@app.get("/api/sponsors", response_model=List[Sponsor])
async def get_sponsors(active_only: bool = True):
    query = {"active": True} if active_only else {}
    sponsors = []
    async for sponsor in sponsors_collection.find(query):
        sponsors.append(Sponsor(**sponsor))
    return sponsors

@app.post("/api/sponsors", response_model=Sponsor)
async def create_sponsor(sponsor: Sponsor):
    sponsor_dict = sponsor.dict()
    await sponsors_collection.insert_one(sponsor_dict)
    return sponsor

# Dashboard stats endpoint
@app.get("/api/stats")
async def get_dashboard_stats():
    total_teams = await teams_collection.count_documents({})
    total_players = await players_collection.count_documents({"is_active": True})
    upcoming_matches = await matches_collection.count_documents({
        "status": "scheduled",
        "match_date": {"$gte": datetime.now()}
    })
    recent_news = await news_collection.count_documents({"published": True})
    
    return {
        "total_teams": total_teams,
        "total_players": total_players,
        "upcoming_matches": upcoming_matches,
        "recent_news": recent_news
    }

@app.get("/api/")
async def root():
    return {"message": "Sports Club API is running!", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)