// ====== API Key and Local Storage Initialization ======
const WeatherApiKey = "a51999e64f394f2db431804269472980";
let recentSearchCities = JSON.parse(localStorage.getItem("recentSearchCities")) || [];

// ====== Fetch Weather Data by City Name ======
function getWeatherData(city) {

  // Add city to recent search list if not already present
  if (!recentSearchCities.includes(city)) {
    recentSearchCities.push(city);
    localStorage.setItem("recentSearchCities", JSON.stringify(recentSearchCities));
    updateRecentCitiesDropdown();
  }

  // API URLs for current weather and 5-day forecast
  const currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WeatherApiKey}&units=metric`;
  const forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WeatherApiKey}&units=metric`;

  // Fetch current weather
  fetch(currentWeatherLink)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        updateCurrentWeather(data); // Display current weather
        return fetch(forecastLink); // Fetch forecast if successful
      } else {
        alert(data.message || "City not found.");
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "200") {
        updateForecastData(data); // Display forecast
      }
    })
    .catch((error) => console.error("Error:", error));
}

// ====== Update Current Weather Section ======
function updateCurrentWeather(data) {
  document.getElementById("current_weather").classList.remove("hidden");

  // Set city name and date
  document.getElementById("location").textContent = `${data.name} (${new Date().toLocaleDateString()})`;

  // Set temperature, wind speed, humidity, and description
  document.getElementById("temperature").textContent = data.main.temp.toFixed(2);
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("description").textContent = data.weather[0].description;

  // Set weather icon and fallback image
  const iconCode = data.weather[0].icon;
  const imageElement = document.getElementById("weather_image");
  imageElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
  imageElement.onerror = () => {
    imageElement.src = "assets/sunny.png"; // Fallback image path
  };
  imageElement.classList.remove("hidden");
}

// ====== Update 5-Day Forecast Section ======
function updateForecastData(data) {
  const forecastDetails = document.getElementById("weather_forcast");
  forecastDetails.innerHTML = "";

  // Filter forecast for midnight (00:00:00) entries
  const forecasts = data.list.filter((f) => f.dt_txt.includes("00:00:00"));

  forecasts.forEach((forecast) => {
    const card = document.createElement("div");
    card.className = "h-94 bg-gradient-to-b from-primary to-secondary text-white text-center p-4 rounded-lg shadow-xl hover:scale-105 transition";

    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    // Create image element with fallback
    const weatherImg = document.createElement("img");
    weatherImg.src = iconUrl;
    weatherImg.alt = "Weather Icon";
    weatherImg.className = "w-16 mx-auto";
    weatherImg.onerror = () => {
      weatherImg.src = "sunny.png";
    };

    // Fill in forecast card details
    card.innerHTML = `
      <h2 class="font-semibold">${date}</h2>
      <div class="my-2" id="img-container"></div>
      <p>Temp: <span class="font-bold">${forecast.main.temp.toFixed(2)}</span>&deg;C.</p>
      <p>Wind: <span class="font-bold">${forecast.wind.speed}</span> M/S</p>
      <p>Humidity: <span class="font-bold">${forecast.main.humidity}</span>%</p>
    `;

    // Append weather image to forecast card
    card.querySelector("#img-container").appendChild(weatherImg);
    forecastDetails.appendChild(card);
  });
}