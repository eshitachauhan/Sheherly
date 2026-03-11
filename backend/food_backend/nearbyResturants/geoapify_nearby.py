import os
import requests
import certifi
from config import GEOAPIFY_API_KEY

# Force Python to trust certificates on Windows
os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

GEOAPIFY_URL = "https://api.geoapify.com/v2/places"


def normalize_name(name: str) -> str:
    return name.lower().strip() if name else ""


def get_nearby_restaurants(latitude, longitude, radius_m=3000, limit=15):
    """
    Fetch nearby restaurants using Geoapify Places API
    """

    params = {
        "categories": "catering.restaurant",
        "filter": f"circle:{longitude},{latitude},{radius_m}",
        "bias": f"proximity:{longitude},{latitude}",
        "limit": limit,
        "apiKey": GEOAPIFY_API_KEY,
    }

    response = requests.get(
        GEOAPIFY_URL,
        params=params,
        timeout=15,
        verify=certifi.where(),
    )

    response.raise_for_status()
    data = response.json()

    seen = set()
    restaurants = []

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        name = props.get("name")

        if not name:
            continue

        key = normalize_name(name)
        if key in seen:
            continue

        seen.add(key)

        restaurants.append(
            {
                "name": name.title(),
                "address": props.get("formatted"),
                "latitude": props.get("lat"),
                "longitude": props.get("lon"),
                "distance_m": props.get("distance"),
                "categories": props.get("categories"),
            }
        )

    return restaurants
