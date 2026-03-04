from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.agent import Agent
from app.models.user import User, UserRole
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.core.dependencies import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("", response_model=List[AgentResponse])
def get_agents(db: Session = Depends(get_db)):
    return db.query(Agent).all()

@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_agent_profile(
    payload: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.agent, UserRole.admin))
):
    existing = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Agent profile already exists")

    agent = Agent(**payload.model_dump(), user_id=current_user.id)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent

@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent_profile(
    agent_id: int,
    payload: AgentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if current_user.role != UserRole.admin and agent.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(agent, key, value)

    db.commit()
    db.refresh(agent)
    return agent