print(">>> chatbot.py loaded <<<")



import os
import certifi
os.environ["SSL_CERT_FILE"] = certifi.where()

# --------------------------------------------------
# IMPORTS
# --------------------------------------------------

import json
import re
import requests
from dotenv import load_dotenv
from prompt import SYSTEM_PROMPT

# --------------------------------------------------
# ENV + MODEL
# --------------------------------------------------

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY missing in .env")

MODEL = "openai/gpt-3.5-turbo"

# --------------------------------------------------
# LOAD CITY DATA
# --------------------------------------------------

DATA_PATH = "sheherly_data/jaipur_city_data.json"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    CITY_DATA = json.load(f)

# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", text.lower()).strip()


def find_section_and_entity(query: str):
    query = normalize(query)

    for section, content in CITY_DATA.items():
        if isinstance(content, dict):
            for key, value in content.items():
                key_norm = normalize(key.replace("_", " "))
                if key_norm in query:
                    return section, key, value

    return None, None, None


def needs_reasoning(query: str) -> bool:
    keywords = [
        "why", "how", "should", "living", "locals",
        "daily life", "culture", "safe", "new to",
        "difference", "working", "adjust"
    ]
    q = query.lower()
    return any(word in q for word in keywords)


def format_response(entity_name: str, data: dict) -> str:
    lines = [f"{entity_name.replace('_', ' ').title()}:\n"]

    for key, value in data.items():
        label = key.replace("_", " ").title()

        if isinstance(value, dict):
            lines.append(f"{label}:")
            for sk, sv in value.items():
                lines.append(f"  - {sk.replace('_',' ').title()}: {sv}")
        elif isinstance(value, list):
            lines.append(f"{label}:")
            for item in value:
                lines.append(f"  - {item}")
        else:
            lines.append(f"{label}: {value}")

    return "\n".join(lines)

# --------------------------------------------------
# AI FALLBACK
# --------------------------------------------------

def ask_ai_fallback(user_query: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Sheherly Chatbot",
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query},
        ],
    }

    try:
        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=20,
            verify=False,  # SSL workaround
        )

        if res.status_code != 200:
            return "Sorry, I’m having trouble answering that right now."

        return res.json()["choices"][0]["message"]["content"]

    except Exception:
        return "Sorry, I’m unable to respond right now."


#  MAIN FUNCTION USED BY FASTAPI


def get_chatbot_response(user_query: str) -> str:
    if not user_query.strip():
        return "Please ask something about Jaipur."

    if "weather" in user_query.lower():
        return (
            "I can share Jaipur’s seasonal weather patterns, "
            "but I don’t have access to live weather updates."
        )

    section, entity, data = find_section_and_entity(user_query)

    if needs_reasoning(user_query):
        return ask_ai_fallback(user_query)

    if data:
        return format_response(entity, data)

    return ask_ai_fallback(user_query)


# OPTIONAL CLI MODE (SAFE)

def main():
    print("\nSheherly – Explore Jaipur Like a Local 🌸")
    print("Type 'exit' to quit\n")

    while True:
        user = input("You: ").strip()
        if user.lower() == "exit":
            print("\nSheherly: Enjoy Jaipur ✨")
            break

        reply = get_chatbot_response(user)
        print("\nSheherly:", reply, "\n")


if __name__ == "__main__":
    main()