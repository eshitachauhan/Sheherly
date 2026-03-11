from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server import router as chat_router
from api.street_food import router as street_router
from api.chill_cafes import router as chill_router
from api.open_night_cafes import router as night_router

app = FastAPI(title="Sheherly Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 ROUTERS
app.include_router(chat_router)
app.include_router(street_router)
app.include_router(chill_router)
app.include_router(night_router)

@app.get("/health")
def health():
    return {"status": "ok"}
