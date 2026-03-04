from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.properties import router as properties_router
from app.routers.agents import router as agents_router
from app.routers.favorites import router as favorites_router
from app.routers.inquiries import router as inquiries_router
from app.routers.images import router as images_router
from app.routers.ai import router as ai_router

app = FastAPI(title="Real Estate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(properties_router)
app.include_router(agents_router)
app.include_router(favorites_router)
app.include_router(inquiries_router)
app.include_router(images_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Real Estate API is running"}