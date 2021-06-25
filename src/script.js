const apiKey = "477355458f09adef7ea7ed5ab3947103";
const unit = "metric";

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

  let openWeatherId = response.data.weather[0].id;
  if (openWeatherId === 800) {
    bigWeatherIcon = "images/clear.png";
  } else if ([801, 802].includes(openWeatherId)) {
    bigWeatherIcon = "images/partly-cloudy.png";
  } else if ([803, 804].includes(openWeatherId)) {
    bigWeatherIcon = "images/cloudy.png";
  } else if (
    [300, 301, 310, 311, 321, 500, 501, 520, 521].includes(openWeatherId)
  ) {
    bigWeatherIcon = "images/rain.png";
  } else if (
    [302, 312, 313, 314, 502, 503, 504, 522, 531].includes(openWeatherId)
  ) {
    bigWeatherIcon = "images/heavy-rain.png";
  } else if (openWeatherId === 511) {
    bigWeatherIcon = "images/freezing-rain.png";
  } else if (
    [600, 601, 611, 612, 613, 615, 616, 620, 621, 622].includes(openWeatherId)
  ) {
    bigWeatherIcon = "images/snow.png";
  } else if ([200, 201, 202, 230, 231, 232].includes(openWeatherId)) {
    bigWeatherIcon = "images/thunderstorm-rain.png";
  } else if ([210, 211, 212, 221].includes(openWeatherId)) {
    bigWeatherIcon = "images/thunderstorm.png";
  } else if ([701, 721].includes(openWeatherId)) {
    bigWeatherIcon = "images/mist.png";
  } else if (openWeatherId === 741) {
    bigWeatherIcon = "images/fog.png";
  } else if (openWeatherId === 781) {
    bigWeatherIcon = "images/tornado.png";
  } else if (openWeatherId === 711) {
    bigWeatherIcon = "images/smoke.png";
  } else if ([731, 751, 761].includes(openWeatherId)) {
    bigWeatherIcon = "images/dust.png";
  } else if (openWeatherId === 762) {
    bigWeatherIcon = "images/volcanic-ash.png";
  } else if (openWeatherId === 771) {
    bigWeatherIcon = "images/squalls.png";
  }

  document
    .querySelector("#big-weather-icon")
    .setAttribute(
      "src",
      bigWeatherIcon,
      "alt",
      response.data.weather[0].description
    );

  celsiusTemperature = response.data.main.temp;

  document.querySelector(".current").innerHTML = Math.round(celsiusTemperature);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#high").innerHTML = Math.round(
    response.data.main.temp_max
  );

  document.querySelector("#low").innerHTML = Math.round(
    response.data.main.temp_min
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

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col order-first day">${formatDay(forecastDay.dt)}</div>
      ${index}
      <div class="col">
        <img
          src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt="partly-cloudy"
          class="small-icon"
        />
      </div>
      <div class="col order-last high-low">
        <div class="row">
          <div class="col">${Math.round(forecastDay.temp.max)}°</div>
          <div class="col">${Math.round(forecastDay.temp.min)}°</div>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function search(city) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";

  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeatherConditions);
}

function handleSubmit(event) {
  let input = document.querySelector("#search-enter");
  let city = input.value;
  search(city);
  input.value = "";
  input.blur();
}

function celsiusClick(event) {
  event.preventDefault();
  let celsius = document.querySelector(".current");
  celsius.innerHTML = Math.round(celsiusTemperature);

  event.currentTarget.classList.add("selected");
  fahrenheitElement.classList.remove("selected");
}

function fahrenheitClick(event) {
  event.preventDefault();
  let fahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);

  let fahrenheitSelect = document.querySelector(".current");
  fahrenheitSelect.innerHTML = `${fahrenheit}`;

  event.currentTarget.classList.add("selected");
  celsiusElement.classList.remove("selected");
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

let celsiusTemperature = null;

let bigWeatherIcon = null;

let celsiusElement = document.querySelector("#celsius");
celsiusElement.addEventListener("click", celsiusClick);

let fahrenheitElement = document.querySelector("#fahrenheit");
fahrenheitElement.addEventListener("click", fahrenheitClick);

let showPositionButton = document.querySelector("#location-button");
showPositionButton.addEventListener("click", showLocation);

search("Berlin");
