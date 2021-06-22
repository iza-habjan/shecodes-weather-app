// date and time

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

formatDate(new Date());

// search engine

function handleSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-enter");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityInput.value}`;
}

let input = document.querySelector("#search-button");
input.addEventListener("click", handleSearch);

// link to Celsius and Fahrenheit

function celsiusClick(event) {
  let celsius = document.querySelector(".current");
  celsius.innerHTML = `29`;

  event.currentTarget.classList.add("selected");
  fahrenheitElement.classList.remove("selected");
}

let celsiusElement = document.querySelector("#celsius");
celsiusElement.addEventListener("click", celsiusClick);

function fahrenheitClick(event) {
  let fahrenheit = Math.round((29 * 9) / 5 + 32);
  let fahrenheitSelect = document.querySelector(".current");
  fahrenheitSelect.innerHTML = `${fahrenheit}`;

  event.currentTarget.classList.add("selected");
  celsiusElement.classList.remove("selected");
}

let fahrenheitElement = document.querySelector("#fahrenheit");
fahrenheitElement.addEventListener("click", fahrenheitClick);

// name of searched city and its current weather conditions

function displayWeatherConditions(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  document.querySelector(".current").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#high").innerHTML = Math.round(
    response.data.main.temp_max
  );

  document.querySelector("#low").innerHTML = Math.round(
    response.data.main.temp_min
  );
}

function search(city) {
  let unit = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "477355458f09adef7ea7ed5ab3947103";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeatherConditions);
}

function handleSubmit(event) {
  let city = document.querySelector("#search-enter").value;
  search(city);
}

let searchCityWeather = document.querySelector("#search-button");
searchCityWeather.addEventListener("click", handleSubmit);

// Geolocation API - GPS coordinates

function showPosition(position) {
  let unit = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "477355458f09adef7ea7ed5ab3947103";

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeatherConditions);
}

function showLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let showPositionButton = document.querySelector("#location-button");
showPositionButton.addEventListener("click", showLocation);

search("Berlin");
