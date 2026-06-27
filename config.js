// =============================================
//  SHEHERLY — CENTRAL CONFIG
//  MAP_URL, CHATBOT_URL, SEARCH_URL still use
//  local IP — update MY_IP when running locally.
//  Run: ipconfig  →  look for IPv4 Address
// =============================================

const MY_IP = "10.145.64.89";

// AUTH is handled by Firebase Auth + Firestore — no AUTH_URL needed
export const ADMIN_URL   = "https://sheherly-admin-api.onrender.com";  //  Deployed on Render
export const MAP_URL     = "https://sheherly-map-api.onrender.com";   //  Deployed on Render
export const CHATBOT_URL = "https://sheherly-chatbot-api.onrender.com";   // Deployed on Render
export const SEARCH_URL  = `http://${MY_IP}:7000`;   // Search/Suggest backend (local)
