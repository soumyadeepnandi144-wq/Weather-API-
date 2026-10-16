// ==========================================================
// SkyPulse Weather - Advanced OpenWeather Engine
// ==========================================================

const apiKey = "88edd47461d4259de877f40cefd59608";

// DOM Elements
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");
const clearInputBtn = document.querySelector("#clearInputBtn");
const unitToggleBtn = document.querySelector("#unitToggleBtn");
const unitC = document.querySelector(".unit-c");
const unitF = document.querySelector(".unit-f");
const recentSearchesContainer = document.querySelector("#recentSearches");

const errorMsg = document.querySelector("#errorMsg");
const loadingSpinner = document.querySelector("#loadingSpinner");
const weatherContainer = document.querySelector("#weatherContainer");
const weatherInfo = document.querySelector("#weatherInfo"); // Backward-compatibility fallback

// Weather Details DOM
const cityName = document.querySelector("#cityName");
const currentDate = document.querySelector("#currentDate");
const weatherBadge = document.querySelector("#weatherBadge");
const tempValue = document.querySelector("#tempValue");
const tempUnit = document.querySelector("#tempUnit");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherDesc = document.querySelector("#weatherDesc");
const feelsLike = document.querySelector("#feelsLike");

// Metrics DOM
const humidityVal = document.querySelector("#humidityVal");
const windVal = document.querySelector("#windVal");
const pressureVal = document.querySelector("#pressureVal");
const visibilityVal = document.querySelector("#visibilityVal");
const sunriseVal = document.querySelector("#sunriseVal");
const sunsetVal = document.querySelector("#sunsetVal");

// Forecast DOM
const forecastContainer = document.querySelector("#forecastContainer");

// Application State
let currentUnit = "metric"; // 'metric' (°C) or 'imperial' (°F)
let currentQueryCity = "";
let currentCoords = null;

// ==========================================================
// EVENT LISTENERS
// ==========================================================

// Search on Button Click
searchBtn.addEventListener("click", () => {
    handleSearch();
});

// Search on Enter Key Press
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// Input Value Change (Show/Hide Clear Button)
cityInput.addEventListener("input", () => {
    clearInputBtn.style.display = cityInput.value.trim() ? "block" : "none";
});

// Clear Input
clearInputBtn.addEventListener("click", () => {
    cityInput.value = "";
    clearInputBtn.style.display = "none";
    cityInput.focus();
});

// GPS Current Location Button
locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            currentCoords = { lat: latitude, lon: longitude };
            currentQueryCity = "";
            getWeatherByCoords(latitude, longitude);
        },
        (error) => {
            hideLoading();
            let msg = "Unable to retrieve your location.";
            if (error.code === error.PERMISSION_DENIED) {
                msg = "Location permission denied. Please search by city name.";
            }
            showError(msg);
        },
        { timeout: 10000 }
    );
});

// Temperature Unit Toggle (°C <-> °F)
unitToggleBtn.addEventListener("click", () => {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    
    if (currentUnit === "metric") {
        unitC.classList.add("active");
        unitF.classList.remove("active");
        tempUnit.textContent = "°C";
    } else {
        unitF.classList.add("active");
        unitC.classList.remove("active");
        tempUnit.textContent = "°F";
    }

    // Refresh current weather in new unit
    if (currentQueryCity) {
        getWeather(currentQueryCity);
    } else if (currentCoords) {
        getWeatherByCoords(currentCoords.lat, currentCoords.lon);
    }
});

// ==========================================================
// WEATHER FETCHING LOGIC
// ==========================================================

function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city or country name.");
        return;
    }
    currentQueryCity = city;
    currentCoords = null;
    getWeather(city);
}

/**
 * Fetch Current Weather + 5-Day Forecast by City Name
 */
async function getWeather(city) {
    showLoading();
    clearError();

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        if (!weatherRes.ok) {
            throw new Error(weatherData.message || "City not found");
        }

        displayWeather(weatherData);

        if (forecastRes.ok) {
            displayForecast(forecastData);
        }

        saveRecentSearch(weatherData.name);
        hideLoading();
    } catch (err) {
        hideLoading();
        showError(err.message || "Unable to fetch weather data. Please try again.");
    }
}

/**
 * Fetch Current Weather + 5-Day Forecast by GPS Coordinates
 */
async function getWeatherByCoords(lat, lon) {
    showLoading();
    clearError();

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        if (!weatherRes.ok) {
            throw new Error(weatherData.message || "Location weather not found");
        }

        displayWeather(weatherData);

        if (forecastRes.ok) {
            displayForecast(forecastData);
        }

        saveRecentSearch(weatherData.name);
        hideLoading();
    } catch (err) {
        hideLoading();
        showError(err.message || "Unable to fetch location weather data.");
    }
}

// ==========================================================
// DISPLAY LOGIC
// ==========================================================

function displayWeather(data) {
    const { name, sys, main, weather, wind, visibility } = data;
    const country = sys.country ? `, ${sys.country}` : "";
    const condition = weather[0].main;
    const desc = weather[0].description;
    const iconCode = weather[0].icon;

    // 1. City and Date
    cityName.textContent = `${name}${country}`;
    currentDate.textContent = formatCurrentDate(data.timezone);
    weatherBadge.textContent = condition;

    // 2. Temp and Icon
    tempValue.textContent = Math.round(main.temp);
    tempUnit.textContent = currentUnit === "metric" ? "°C" : "°F";
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = desc;
    weatherDesc.textContent = desc;

    const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
    feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}${unitSymbol} • High: ${Math.round(main.temp_max)}${unitSymbol} • Low: ${Math.round(main.temp_min)}${unitSymbol}`;

    // 3. Metrics Details
    humidityVal.textContent = `${main.humidity}%`;
    const speedUnit = currentUnit === "metric" ? "m/s" : "mph";
    windVal.textContent = `${wind.speed} ${speedUnit}`;
    pressureVal.textContent = `${main.pressure} hPa`;
    
    // Visibility (meters to km / miles)
    if (visibility) {
        const visDist = currentUnit === "metric" 
            ? `${(visibility / 1000).toFixed(1)} km` 
            : `${(visibility / 1609.34).toFixed(1)} mi`;
        visibilityVal.textContent = visDist;
    } else {
        visibilityVal.textContent = "N/A";
    }

    // Sunrise & Sunset
    sunriseVal.textContent = formatTime(sys.sunrise, data.timezone);
    sunsetVal.textContent = formatTime(sys.sunset, data.timezone);

    // 4. Update Dynamic Theme
    updateTheme(condition, iconCode);

    // 5. Update Backward Compatibility UL (#weatherInfo)
    weatherInfo.innerHTML = `
        <li><strong>${name}${country}</strong></li>
        <li><img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}"></li>
        <li>${Math.round(main.temp)}${unitSymbol} (feels like ${Math.round(main.feels_like)}${unitSymbol})</li>
        <li>${desc}</li>
        <li>Humidity: ${main.humidity}%</li>
        <li>Wind: ${wind.speed} ${speedUnit}</li>
    `;

    // Make weather card visible
    weatherContainer.style.display = "flex";
}

/**
 * Display 5-Day Forecast
 */
function displayForecast(forecastData) {
    forecastContainer.innerHTML = "";
    if (!forecastData || !forecastData.list) return;

    // Group forecast items by calendar day (selecting ~12:00 midday slot for each day)
    const dailyMap = new Map();

    forecastData.list.forEach((item) => {
        const dateObj = new Date(item.dt * 1000);
        const dayKey = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

        // Prefer forecasts around midday (12:00)
        if (!dailyMap.has(dayKey)) {
            dailyMap.set(dayKey, item);
        } else {
            const currentSelected = dailyMap.get(dayKey);
            const currentHour = new Date(currentSelected.dt * 1000).getHours();
            const newHour = dateObj.getHours();
            if (Math.abs(newHour - 12) < Math.abs(currentHour - 12)) {
                dailyMap.set(dayKey, item);
            }
        }
    });

    // Take next 5 days
    const nextFiveDays = Array.from(dailyMap.entries()).slice(1, 6);

    nextFiveDays.forEach(([dayLabel, dataPoint]) => {
        const card = document.createElement("div");
        card.className = "forecast-card";

        const dateObj = new Date(dataPoint.dt * 1000);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dateFormatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const icon = dataPoint.weather[0].icon;
        const desc = dataPoint.weather[0].main;
        const temp = Math.round(dataPoint.main.temp);
        const unitSymbol = currentUnit === "metric" ? "°" : "°";

        card.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <span class="forecast-date">${dateFormatted}</span>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
            <span class="forecast-temp">${temp}${unitSymbol}</span>
            <span class="forecast-desc">${desc}</span>
        `;

        forecastContainer.appendChild(card);
    });
}

// ==========================================================
// BACKGROUND THEME ADAPTER
// ==========================================================

function updateTheme(condition, iconCode) {
    const body = document.body;
    body.className = ""; // Reset existing classes

    const isNight = iconCode && iconCode.endsWith("n");
    const lowerCond = condition.toLowerCase();

    if (isNight) {
        body.classList.add("theme-night");
    } else if (lowerCond.includes("clear")) {
        body.classList.add("theme-clear");
    } else if (lowerCond.includes("cloud")) {
        body.classList.add("theme-clouds");
    } else if (lowerCond.includes("rain") || lowerCond.includes("drizzle")) {
        body.classList.add("theme-rain");
    } else if (lowerCond.includes("thunderstorm")) {
        body.classList.add("theme-thunderstorm");
    } else if (lowerCond.includes("snow")) {
        body.classList.add("theme-snow");
    } else if (lowerCond.includes("mist") || lowerCond.includes("fog") || lowerCond.includes("haze")) {
        body.classList.add("theme-mist");
    } else {
        body.classList.add("theme-default");
    }
}

// ==========================================================
// RECENT SEARCHES (LOCALSTORAGE)
// ==========================================================

function saveRecentSearch(cityName) {
    if (!cityName) return;
    try {
        let recents = JSON.parse(localStorage.getItem("skypulse_recents")) || [];
        // Remove duplicate if already present
        recents = recents.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
        // Prepend new city
        recents.unshift(cityName);
        // Limit to 5
        recents = recents.slice(0, 5);
        localStorage.setItem("skypulse_recents", JSON.stringify(recents));
        renderRecentSearches();
    } catch (e) {
        console.warn("Storage error:", e);
    }
}

function renderRecentSearches() {
    try {
        const recents = JSON.parse(localStorage.getItem("skypulse_recents")) || [];
        recentSearchesContainer.innerHTML = "";

        recents.forEach((city) => {
            const chip = document.createElement("button");
            chip.className = "recent-chip";
            chip.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${city}`;
            chip.addEventListener("click", () => {
                cityInput.value = city;
                clearInputBtn.style.display = "block";
                handleSearch();
            });
            recentSearchesContainer.appendChild(chip);
        });
    } catch (e) {
        console.warn("Error rendering recents:", e);
    }
}

// ==========================================================
// UTILITY HELPERS
// ==========================================================

function formatCurrentDate(timezoneOffsetSeconds = 0) {
    const now = new Date();
    // Adjust for city timezone offset
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + timezoneOffsetSeconds * 1000);

    return cityDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function formatTime(unixSeconds, timezoneOffsetSeconds = 0) {
    if (!unixSeconds) return "--:--";
    const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
    return date.toUTCString().slice(17, 22) + (date.getUTCHours() >= 12 ? " PM" : " AM");
}

function showLoading() {
    loadingSpinner.style.display = "flex";
    errorMsg.style.display = "none";
}

function hideLoading() {
    loadingSpinner.style.display = "none";
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
    weatherContainer.style.display = "none";
}

function clearError() {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
}

// ==========================================================
// INITIAL SETUP ON PAGE LOAD
// ==========================================================

window.addEventListener("DOMContentLoaded", () => {
    renderRecentSearches();

    // Default to last searched city, or popular default
    const recents = JSON.parse(localStorage.getItem("skypulse_recents")) || [];
    const defaultCity = recents.length > 0 ? recents[0] : "London";
    getWeather(defaultCity);
});