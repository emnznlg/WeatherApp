const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img");
const backBtn = document.querySelector(".bx-left-arrow-alt");
const apiKey =
  "YOU NEED TO PASTE HERE YOUR OWN API KEY FROM OPENWEATHERMAP.COM";
let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSucces, onError);
  } else {
    alert("Please allow location on your browser settings");
  }
});

function onSucces(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  //Aşağıdaki olayı tam anlamadım...
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `"${inputField.value}" isn't a valid city name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id > 799 && id < 805) {
      wIcon.src = "Weather Icons/cloud.svg";
    }
    if (id === 800) {
      wIcon.src = "Weather Icons/clear.svg";
    }
    if (id >= 701 && id <= 781) {
      wIcon.src = "Weather Icons/haze.svg";
    }
    if (id > 500 && id <= 531) {
      wIcon.src = "Weather Icons/rain.svg";
    }
    if (id >= 600 && id <= 622) {
      wIcon.src = "Weather Icons/snow.svg";
    }
    if (id >= 200 && id <= 232) {
      wIcon.src = "Weather Icons/storm.svg";
    }

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description.toUpperCase();
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity .details span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}

backBtn.addEventListener("click", () => {
  inputField.value = "";
  wrapper.classList.remove("active");
});
