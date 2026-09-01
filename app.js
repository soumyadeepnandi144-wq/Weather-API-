let cityInput = document.querySelector("#cityInput");
let searchBtn = document.querySelector("#searchBtn");
let weatherInfo = document.querySelector("#weatherInfo");
let errorMsg = document.querySelector("#errorMsg");

let apiKey = "88edd47461d4259de877f40cefd59608";

searchBtn.addEventListener("click", function () {
        let city = cityInput.value.trim();
        if(city === ""){
            errorMsg.textContent = "Please enter a city name";
            return;
        }
        getWeather(city);
    });

async function getWeather(city) {
    errorMsg.textContent="";
    weatherInfo.innerHTML="";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{
        let response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayWeather(data);
    }
    catch(err){
        errorMsg.textContent = err.message;
    }
}     

function displayWeather(data){
    const {name} = data;
    const { temp, feels_like, humidity } = data.main;
    const { description, icon } = data.weather[0];
    const windSpeed = data.wind.speed;

    weatherInfo.innerHTML = `
    <li><strong>${name}</strong></li>
    <li><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"></li>
    <li>${temp}°C (feels like ${feels_like}°C)</li>
    <li>${description}</li>
    <li>Humidity: ${humidity}%</li>
    <li>Wind: ${windSpeed} m/s</li>
  `;
}