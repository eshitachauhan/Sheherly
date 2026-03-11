from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from geoapify_nearby import get_nearby_restaurants
import os

app = FastAPI(title="Nearby Restaurants API")
app.mount("/images", StaticFiles(directory="images"), name="images")

# ---------- CORS  ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Static images ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")

app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# ---------- API ----------
@app.get("/nearby-restaurants")
def nearby_restaurants(
    latitude: float = Query(26.9124, description="Default Jaipur latitude"),
    longitude: float = Query(75.8124, description="Default Jaipur longitude"),
    radius_m: int = Query(3000),
    limit: int = Query(20),
):
    restaurants = get_nearby_restaurants(
        latitude=latitude,
        longitude=longitude,
        radius_m=radius_m,
        limit=limit,
    )

    # TEMP image logic
    for i, r in enumerate(restaurants):
        if i < 2:
            r["image"] = "http://10.27.236.138:8000/images/restaurants/rest1.jpeg"
        else:
            r["image"] = "http://10.27.236.138:8000/images/fallbacks/fall1.jpeg"

    return {
        "user_location": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "restaurants": restaurants,
    }