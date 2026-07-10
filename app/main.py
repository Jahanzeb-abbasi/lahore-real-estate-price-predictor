from fastapi import FastAPI
from app.schemas import HouseFeatures
from app.predictor import predict_price, get_locations

app = FastAPI()

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

