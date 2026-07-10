// Point this at your deployed FastAPI backend before going live.
// Keep it as-is for local development against `uvicorn`.
const API_URL = "http://127.0.0.1:8000";

const form = document.getElementById("prediction-form");
const locationInput = document.getElementById("location");
const locationOptions = document.getElementById("location-options");

const result = document.getElementById("prediction-result");
const statusText = document.getElementById("prediction-status");

const button = document.getElementById("predict-btn");
const buttonText = document.getElementById("btn-text");
const spinner = document.getElementById("spinner");

/* ==========================
   Currency Formatter
========================== */

function formatPrice(price) {
    if (price >= 10000000) {
        return `PKR ${(price / 10000000).toFixed(2)} Crore`;
    }
    if (price >= 100000) {
        return `PKR ${(price / 100000).toFixed(2)} Lakh`;
    }
    return `PKR ${price.toLocaleString()}`;
}

/* ==========================
   Button States
========================== */

function showLoading() {
    button.disabled = true;
    buttonText.textContent = "Estimating…";
    spinner.classList.remove("hidden");
    result.textContent = "Calculating";
    statusText.textContent = "Running the model…";
}

function hideLoading() {
    button.disabled = false;
    buttonText.textContent = "Estimate value";
    spinner.classList.add("hidden");
}

/* ==========================
   Load Locations
========================== */

async function loadLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        locationOptions.innerHTML = "";

        data.locations.forEach(location => {
            const option = document.createElement("option");
            option.value = location;
            locationOptions.appendChild(option);
        });

        locationInput.placeholder = "Type to search, or click to browse";
    } catch (error) {
        locationInput.placeholder = "Unable to load locations. Type one manually";
        console.error(error);
    }
}

loadLocations();

/* ==========================
   Predict
========================== */

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    showLoading();

    const payload = {
        Area_Marla: Number(document.getElementById("area").value),
        Bedrooms: Number(document.getElementById("bedrooms").value),
        Bathrooms: Number(document.getElementById("bathrooms").value),
        Built_Year: Number(document.getElementById("built-year").value),
        Kitchens: Number(document.getElementById("kitchens").value),
        Store_Rooms: Number(document.getElementById("store-rooms").value),
        Servant_Quarters: Number(document.getElementById("servant-quarters").value),
        Location: locationInput.value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        result.textContent = formatPrice(Number(data.predicted_price));
        statusText.textContent = "Estimate generated from your inputs.";

        document.getElementById("result-location").textContent = locationInput.value.trim();
        document.getElementById("result-area").textContent =
            document.getElementById("area").value + " Marla";
        document.getElementById("result-bedrooms").textContent =
            document.getElementById("bedrooms").value;
        document.getElementById("result-bathrooms").textContent =
            document.getElementById("bathrooms").value;

    } catch (error) {
        result.textContent = "Estimate failed";
        statusText.textContent = "Couldn't reach the API. Confirm the backend is running.";
        console.error(error);
    } finally {
        hideLoading();
    }
});

/* ==========================
   Responsive Nav Toggle
========================== */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});
