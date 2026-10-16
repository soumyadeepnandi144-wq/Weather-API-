# SkyPulse | Real-Time Weather & 5-Day Forecast App 🌤️

A modern, responsive, and feature-rich **Weather Application** built with vanilla HTML5, CSS3 Glassmorphism, and JavaScript, powered by the OpenWeatherMap REST API.

![SkyPulse Weather App](https://img.shields.io/badge/Status-Active-brightgreen)
![Vanilla JS](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20JavaScript-yellow)
![API](https://img.shields.io/badge/API-OpenWeatherMap-blue)

---

## ✨ Features

- **🌡️ Live Real-Time Weather**:
  - Accurate current temperature, feels-like temperature, and daily min/max readings.
  - High-resolution weather icons directly from OpenWeatherMap.
  - Formatted local date and time adjusted for each city's timezone.
- **📅 5-Day Extended Forecast**:
  - Clean day-by-day forecast cards showing upcoming weather conditions, midday temperatures, and icons.
- **📍 GPS Current Location**:
  - One-click geolocation button (`navigator.geolocation`) to immediately fetch weather for your exact coordinates.
- **🔄 Celsius (°C) / Fahrenheit (°F) Toggle**:
  - Instantly switch temperature and wind speed units without losing your search context.
- **🎨 Dynamic Weather-Adaptive Backgrounds**:
  - Background gradients automatically transform depending on current weather conditions (Clear, Clouds, Rain, Snow, Thunderstorm, Mist, or Night).
- **📊 Comprehensive Weather Metrics Grid**:
  - Humidity (%)
  - Wind Speed (m/s or mph)
  - Atmospheric Pressure (hPa)
  - Visibility (km or miles)
  - Sunrise & Sunset local times
- **🕒 Recent Searches History**:
  - Quick-search chips saved in `localStorage` for 1-tap access to your recently viewed cities.
- **⚡ Keyboard Friendly & Robust UX**:
  - Supports pressing <kbd>Enter</kbd> to search.
  - Quick-clear button for the search input.
  - Graceful error banners for typos or network outages.
  - Smooth loading spinners.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup.
- **CSS3**: Modern Glassmorphism aesthetic (`backdrop-filter: blur`), responsive CSS grid and flexbox, custom scrollbars, and fluid animations.
- **JavaScript (ES6+)**: Asynchronous `fetch` calls, `Promise.all` for parallel weather and forecast retrieval, Geolocation API, and `localStorage`.
- **OpenWeatherMap API**: Current Weather Data & 5-Day / 3-Hour Forecast endpoints.
- **Font Awesome 6.5.2 & Google Fonts**: Vector iconography and clean Poppins typography.

---

## 🚀 How to Run Locally

No external packages or build tools are required!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/soumyadeepnandi144-wq/Weather-API-.git
   cd Weather-API-
   ```

2. **Open in Browser**:
   - Simply double-click `index.html` to open it in your default web browser, **OR**
   - In **VS Code**, right-click `index.html` and choose **"Open with Live Server"**.

---

## 📁 Project Structure

```text
Weather-API-/
├── index.html       # Semantic HTML5 UI with glassmorphism layout
├── style.css        # Adaptive weather themes, CSS grid, and mobile styling
├── app.js           # Weather engine, geolocation, unit converter & storage
└── README.md        # Comprehensive project documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
