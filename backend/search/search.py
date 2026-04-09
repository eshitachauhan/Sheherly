from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import string
import nltk
import difflib
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

app = Flask(__name__)
CORS(app)

stemmer = PorterStemmer()


try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))

CATEGORY_KEYWORDS = {
    "accommodation": [
        "stay", "room", "rooms", "hotel", "hotels", "hostel", "hostels",
        "pg", "guest", "guesthouse", "flat", "rent", "airbnb", "homestay",
        "accommodation", "living", "apartment", "boys hostel", "girls hostel"
    ],
    "food": [
        "food", "foods", "restaurant", "restaurants", "restraunt", "restraunts",
        "cafe", "cafes", "coffee", "tea", "bakery", "pizza", "burger",
        "biryani", "mess", "tiffin", "breakfast", "lunch", "dinner", "eat",
        "street food", "fast food"
    ],
    "transportation": [
        "transport", "travel", "bus", "buses", "train", "railway", "metro",
        "auto", "rickshaw", "taxi", "cab", "uber", "ola", "rapido", "bike",
        "station", "bus stop", "railway station"
    ],
    "medical": [
        "hospital", "hospitals", "clinic", "doctor", "doctors", "medical",
        "pharmacy", "chemist", "medicine", "ambulance", "dentist", "health",
        "medical store"
    ],
    "localServices": [
        "bank", "banks", "atm", "atms", "market", "markets", "shop", "shops",
        "grocery", "groceries", "kirana", "store", "supermarket", "mart",
        "stationery", "mobile shop", "electronics", "laundry", "salon", "repair"
    ],
    "famousSpots": [
        "famous", "tourist", "places", "visit", "hangout", "mall", "park",
        "garden", "museum", "zoo", "lake", "temple", "mandir", "church",
        "mosque", "masjid", "monument", "water park", "amusement park"
    ]
}

CATEGORY_ROUTES = {
    "accommodation": "/category/accommodation",
    "food": "/category/food",
    "transportation": "/category/transportation",
    "medical": "/category/medical",
    "localServices": "/category/localServices",
    "famousSpots": "/category/famousSpots"
}


def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()

    cleaned_words = []
    for word in words:
        if word not in stop_words:
            cleaned_words.append(stemmer.stem(word))

    return cleaned_words


def fuzzy_match(token, keyword_list):
    matches = difflib.get_close_matches(token, keyword_list, n=1, cutoff=0.75)
    return len(matches) > 0


def detect_category(query):
    tokens = preprocess_text(query)
    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        keyword_stems = [stemmer.stem(k.lower()) for k in keywords]

        for token in tokens:
            if token in keyword_stems:
                score += 2
            elif fuzzy_match(token, keyword_stems):
                score += 1

        scores[category] = score

    best_category = max(scores, key=scores.get)

    if scores[best_category] == 0:
        return None

    return best_category


def extract_filters(query):
    lower = query.lower()
    filters = {}

   
    if "pg" in lower or "guest" in lower:
        filters["type"] = "pg"
    elif "hostel" in lower:
        filters["type"] = "hostel"
    elif "hotel" in lower:
        filters["type"] = "hotel"
    elif "airbnb" in lower:
        filters["type"] = "airbnb"
    elif "flat" in lower or "apartment" in lower:
        filters["type"] = "flat"

   
    elif "restaurant" in lower or "restaurants" in lower or "restraunt" in lower or "restraunts" in lower:
        filters["type"] = "restaurant"
    elif "cafe" in lower or "cafes" in lower or "coffee" in lower:
        filters["type"] = "cafe"
    elif "bakery" in lower:
        filters["type"] = "bakery"
    elif "street food" in lower:
        filters["type"] = "streetfood"
    elif "mess" in lower or "tiffin" in lower:
        filters["type"] = "mess"

    
    elif "bus" in lower:
        filters["type"] = "bus"
    elif "train" in lower or "railway" in lower:
        filters["type"] = "train"
    elif "metro" in lower:
        filters["type"] = "metro"
    elif "auto" in lower or "rickshaw" in lower:
        filters["type"] = "auto"
    elif "cab" in lower or "taxi" in lower or "uber" in lower or "ola" in lower:
        filters["type"] = "cab"

    
    elif "hospital" in lower:
        filters["type"] = "hospital"
    elif "clinic" in lower:
        filters["type"] = "clinic"
    elif "pharmacy" in lower or "chemist" in lower or "medical store" in lower:
        filters["type"] = "pharmacy"
    elif "doctor" in lower:
        filters["type"] = "doctor"


    elif "atm" in lower:
        filters["type"] = "atm"
    elif "bank" in lower:
        filters["type"] = "bank"
    elif "grocery" in lower or "kirana" in lower or "supermarket" in lower:
        filters["type"] = "grocery"
    elif "laundry" in lower:
        filters["type"] = "laundry"
    elif "salon" in lower:
        filters["type"] = "salon"
    elif "stationery" in lower:
        filters["type"] = "stationery"
    elif "mobile shop" in lower or "electronics" in lower:
        filters["type"] = "electronics"


    elif "temple" in lower or "mandir" in lower:
        filters["type"] = "temple"
    elif "mall" in lower:
        filters["type"] = "mall"
    elif "park" in lower or "garden" in lower:
        filters["type"] = "park"
    elif "museum" in lower:
        filters["type"] = "museum"
    elif "zoo" in lower:
        filters["type"] = "zoo"
    elif "lake" in lower:
        filters["type"] = "lake"
    elif "church" in lower:
        filters["type"] = "church"
    elif "mosque" in lower or "masjid" in lower:
        filters["type"] = "mosque"

   
    price_match = re.search(r'under\s*(\d+)', lower)
    if price_match:
        filters["maxPrice"] = int(price_match.group(1))

    return filters


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({
            "success": False,
            "message": "Empty query"
        })

    category = detect_category(query)

    if not category:
        return jsonify({
            "success": False,
            "message": "No matching category found"
        })

    route = CATEGORY_ROUTES[category]
    filters = extract_filters(query)

    return jsonify({
        "success": True,
        "category": category,
        "route": route,
        "filters": filters
    })


@app.route("/suggest", methods=["POST"])
def suggest():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({
            "success": True,
            "suggestions": []
        })

    category = detect_category(query)
    filters = extract_filters(query)

    suggestions = []

    if filters.get("type"):
        suggestions.append(filters["type"])

    if category:
        suggestions.append(category)

    return jsonify({
        "success": True,
        "suggestions": list(dict.fromkeys(suggestions))
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)