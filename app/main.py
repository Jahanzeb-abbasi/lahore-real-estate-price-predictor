from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import HouseFeatures
from app.predictor import predict_price, get_locations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def msg():
    return {"message": "API is working!"}

@app.get("/locations")
def locations():
    return {"locations": get_locations()}

@app.post("/predict")
def predict(features: HouseFeatures):
    prediction = predict_price(features)
    return {"predicted_price": prediction}

