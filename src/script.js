const apiKey = "477355458f09adef7ea7ed5ab3947103";
const unit = "metric";

let usersUnit = "metric";

function handleSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-enter");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityInput.value}`;
}

function formatDate(today) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[today.getDay()];

  let date = today.getDate();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[today.getMonth()];

  let hour = today.getHours();
  if (hour < 10) hour = `0${hour}`;
  let minutes = today.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;

  let todayElement = document.querySelector("#today");
  todayElement.innerHTML = `${day}, ${date}. ${month}, ⏰ ${hour}:${minutes}`;
}

function displayWeatherConditions(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  document
    .querySelector("#big-weather-icon")
    .setAttribute(
      "src",
      getCustomIcon(response.data.weather[0].id),
      "alt",
      response.data.weather[0].description
    );

  celsiusTemperature = response.data.main.temp;

  document.querySelector(".current").innerHTML =
    getTemperature(celsiusTemperature);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function getForecast(coordinates) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";

  let apiUrl = `${apiEndpoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function getCustomIcon(id) {
  let weatherIcon;

  if (id === 800) {
    weatherIcon = "images/clear.png";
  } else if ([801, 802].includes(id)) {
    weatherIcon = "images/partly-cloudy.png";
  } else if ([803, 804].includes(id)) {
    weatherIcon = "images/cloudy.png";
  } else if ([300, 301, 310, 311, 321, 500, 501, 520, 521].includes(id)) {
    weatherIcon = "images/rain.png";
  } else if ([302, 312, 313, 314, 502, 503, 504, 522, 531].includes(id)) {
    weatherIcon = "images/heavy-rain.png";
  } else if (id === 511) {
    weatherIcon = "images/freezing-rain.png";
  } else if ([600, 601, 611, 612, 613, 615, 616, 620, 621, 622].includes(id)) {
    weatherIcon = "images/snow.png";
  } else if ([200, 201, 202, 230, 231, 232].includes(id)) {
    weatherIcon = "images/thunderstorm-rain.png";
  } else if ([210, 211, 212, 221].includes(id)) {
    weatherIcon = "images/thunderstorm.png";
  } else if ([701, 721].includes(id)) {
    weatherIcon = "images/mist.png";
  } else if (id === 741) {
    weatherIcon = "images/fog.png";
  } else if (id === 781) {
    weatherIcon = "images/tornado.png";
  } else if (id === 711) {
    weatherIcon = "images/smoke.png";
  } else if ([731, 751, 761].includes(id)) {
    weatherIcon = "images/dust.png";
  } else if (id === 762) {
    weatherIcon = "images/volcanic-ash.png";
  } else if (id === 771) {
    weatherIcon = "images/squalls.png";
  }

  return weatherIcon;
}

function displayForecast(response = forecastResponse) {
  forecastResponse = response;

  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="container">
        <div class="row">
        <div class="col order-first day">${formatDay(forecastDay.dt)}</div>
        <div class="col">
          <img
            src="${getCustomIcon(forecastDay.weather[0].id)}"
            alt="partly-cloudy"
            class="small-icon"
          />
        </div>
        <div class="col order-last high-low">
          <div class="row forecast-temperature">
            <div class="col">${getTemperature(forecastDay.temp.max)}°</div>
            <div class="col">${getTemperature(forecastDay.temp.min)}°</div>
          </div>
        </div>
        </div>
      </div>
  `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function search(city = "Berlin") {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";

  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeatherConditions);
}

function handleSubmit() {
  let input = document.querySelector("#search-enter");
  let city = input.value;
  search(city);
  input.value = "";
  input.blur();
}

function celsiusClick(event) {
  event.preventDefault();

  usersUnit = "metric";

  let celsius = document.querySelector(".current");
  celsius.innerHTML = Math.round(celsiusTemperature);

  event.currentTarget.classList.add("selected");
  fahrenheitElement.classList.remove("selected");

  displayForecast();
}

function fahrenheitClick(event) {
  event.preventDefault();

  usersUnit = "imperial";

  let fahrenheit = getTemperature(celsiusTemperature);

  let fahrenheitSelect = document.querySelector(".current");
  fahrenheitSelect.innerHTML = `${fahrenheit}`;

  event.currentTarget.classList.add("selected");
  celsiusElement.classList.remove("selected");

  displayForecast();
}

function getTemperature(value) {
  if (usersUnit === "metric") {
    return Math.round(value);
  } else {
    return Math.round((value * 9) / 5 + 32);
  }
}

function showPosition(position) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeatherConditions);
}

function showLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let input = document.querySelector("#search-button");
input.addEventListener("click", handleSearch);

formatDate(new Date());

let searchCityWeather = document.querySelector("#search-button");
searchCityWeather.addEventListener("click", handleSubmit);

let celsiusTemperature;

let bigWeatherIcon;

let forecastResponse;

let celsiusElement = document.querySelector("#celsius");
celsiusElement.addEventListener("click", celsiusClick);

let fahrenheitElement = document.querySelector("#fahrenheit");
fahrenheitElement.addEventListener("click", fahrenheitClick);

let showPositionButton = document.querySelector("#location-button");
showPositionButton.addEventListener("click", showLocation);

search();
