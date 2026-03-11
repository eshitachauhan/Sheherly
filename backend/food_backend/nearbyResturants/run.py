from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"status": "working"}

if __name__ == "__main__":
    uvicorn.run(
    "api:app",
    host="0.0.0.0",   # allow other devices
    port=8000,
    reload=True
)