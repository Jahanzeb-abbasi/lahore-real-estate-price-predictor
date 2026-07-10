import joblib
import pandas as pd

model = joblib.load("models/linear_regression.joblib")
feature_columns = joblib.load("models/feature_columns.joblib")

def predict_price(features):
    feature_dict = {col: 0 for col in feature_columns}

    feature_dict["Area_Marla"] = features.Area_Marla
    feature_dict["Bedrooms"] = features.Bedrooms
    feature_dict["Bathrooms"] = features.Bathrooms
    feature_dict["Built Year"] = features.Built_Year
    feature_dict["Kitchens"] = features.Kitchens
    feature_dict["Store Rooms"] = features.Store_Rooms
    feature_dict["Servant Quarters"] = features.Servant_Quarters
    
    location_column = f"Location_Clean_{features.Location}"
    if location_column in feature_dict:
        feature_dict[location_column] = 1
    else:
        feature_dict["Location_Clean_Other"] = 1

    input_df = pd.DataFrame([feature_dict])
    
    prediction = model.predict(input_df)
    return float(prediction[0])
    

def get_locations():
    locations = []

    for col in feature_columns:
        if col.startswith("Location_Clean_"):
            location = col.replace("Location_Clean_", "")

            if location != "Other":
                locations.append(location)

    return sorted(locations)       


