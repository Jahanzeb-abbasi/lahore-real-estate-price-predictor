const API_URL = "http://127.0.0.1:8000";

const form = document.getElementById("prediction-form");
const locationSelect = document.getElementById("location");
const result = document.getElementById("prediction-result");
const predictBtn = document.getElementById("predict-btn");


// ===============================
// Load Locations
// ===============================

async function loadLocations() {

    try {

        const response = await fetch(`${API_URL}/locations`);

        const data = await response.json();

        locationSelect.innerHTML = "";

        data.locations.forEach(location => {

            const option = document.createElement("option");

            option.value = location;
            option.textContent = location;

            locationSelect.appendChild(option);

        });

    }

    catch(error){

        locationSelect.innerHTML =
            "<option>Unable to load locations</option>";

        console.error(error);

    }

}

loadLocations();


// ===============================
// Predict Price
// ===============================

form.addEventListener("submit", async function(event){

    event.preventDefault();

    predictBtn.disabled = true;
    predictBtn.textContent = "Predicting...";

    result.textContent = "Calculating...";


    const payload = {

        Area_Marla: Number(document.getElementById("area").value),

        Bedrooms: Number(document.getElementById("bedrooms").value),

        Bathrooms: Number(document.getElementById("bathrooms").value),

        Built_Year: Number(document.getElementById("built-year").value),

        Kitchens: Number(document.getElementById("kitchens").value),

        Store_Rooms: Number(document.getElementById("store-rooms").value),

        Servant_Quarters: Number(document.getElementById("servant-quarters").value),

        Location: locationSelect.value

    };


    try{

        const response = await fetch(`${API_URL}/predict`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(payload)

        });

        if(!response.ok){

            throw new Error("Prediction failed.");

        }

        const data = await response.json();

        const price = Number(data.predicted_price);

        result.textContent =
            `PKR ${price.toLocaleString()}`;

    }

    catch(error){

        result.textContent = "Prediction failed.";

        console.error(error);

    }

    finally{

        predictBtn.disabled = false;
        predictBtn.textContent = "Predict Price";

    }

});