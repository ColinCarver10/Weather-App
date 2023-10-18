const APIKEY = "e90147a542b965c22c83c8159cd5053c";
const GEOURL = "https://api.openweathermap.org/geo/1.0/direct?";
const WEATHERURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial";

const currentDay = new Date()
let nextDay = new Date(currentDay);

const citySearch = document.querySelector(".search input");
const stateSearch = document.querySelector(".stateSelector");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const resetButton = document.querySelector(".reset button");
const minusDay = document.querySelector(".minusDay button");
const plusDay = document.querySelector(".plusDay button");

let currentDayIndex = 0;


async function checkWeather(lat, long) {
    const RESPONSE = await fetch(WEATHERURL + `&lat=${lat}&lon=${long}&appid=${APIKEY}`);
    var data = await RESPONSE.json();   

    nextDay.setDate(currentDay.getDate() + currentDayIndex)

    document.querySelector(".currentDate").innerHTML = nextDay.toString().slice(0, 3);
    document.querySelector(".city").innerHTML = data.city.name;
    document.querySelector(".temp").innerHTML = Math.round(data.list[currentDayIndex * 8 + 4].main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.list[currentDayIndex * 8 + 4].main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.list[currentDayIndex * 8 + 4].wind.speed) + " mph";
    
    // Setting time to noon (4, 12, 20, etc.)
    if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } 
    else if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png";
    }
    else if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png";
    }
    else if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
    }
    else if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png";
    }
    else if (data.list[currentDayIndex * 8 + 4].weather[0].main == "Snow") {
        weatherIcon.src = "images/snow.png";
    }

    document.querySelector('.weather').style.display = "block";
    document.querySelector(".error").style.display = "none";
    document.querySelector(".reset button").style.display = "block";
    document.querySelector(".minusDay button").style.display = "block";
    document.querySelector(".plusDay button").style.display = "block";


}

async function findCityCode(city, state) {
    const RESPONSE = await fetch(GEOURL + `q=${city},${state}&appid=${APIKEY}`);
    var data = await RESPONSE.json();
    
    return [data[0].lat, data[0].lon];    
    
}

function updateWeather() {
    const promise = findCityCode(citySearch.value, stateSearch.options[stateSearch.selectedIndex].text);
    promise.then((data) => {checkWeather(data[0], data[1])})
    .catch(()=>{console.log("Invalid search!")});
}

searchButton.addEventListener("click", () => {
    updateWeather();
})

resetButton.addEventListener("click", () => {
    location.reload();
})

minusDay.addEventListener("click", () => {
    if(currentDayIndex > 0) {
        currentDayIndex -= 1;
        updateWeather();
    }
})

plusDay.addEventListener("click", () => {
    if(currentDayIndex < 4) {
        currentDayIndex += 1;
        updateWeather();
    }
})