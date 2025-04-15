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