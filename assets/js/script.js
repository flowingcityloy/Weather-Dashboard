var searchCity = document.querySelector("#search-query")
var searchBtn = document.querySelector("#search-btn")
var textFrame = document.querySelector(".text-frame")
var flexBox = document.querySelector(".flexbox")
var searchHistoryEl = document.querySelector("#search-history")
var searchHistory = JSON.parse(localStorage.getItem("history")) || []


searchBtn.addEventListener("click", function () {

  // Search history is kept but only showing one time on the page
  if (searchHistory.indexOf(searchCity.value) === -1) {
    searchHistory.push(searchCity.value)

    localStorage.setItem("history", JSON.stringify(searchHistory))
  }


  getCityWeather(searchCity.value);

  getSearchResult()
})

getSearchResult()

// search results
function getSearchResult() {
  searchHistoryEl.innerHTML = ""
  for (let i = 0; i < searchHistory.length; i++) {
    searchHistoryEl.innerHTML = searchHistoryEl.innerHTML + `
    <div class="row">
    <a class="search-results btn center grey lighten-2 col s11">
    <span class="center black-text">${searchHistory[i]}</span>
    </a>
    </div>
    `
  }

  var searchResults = document.querySelectorAll(".search-results")

  for (let i = 0; i < searchResults.length; i++) {
    searchResults[i].addEventListener("click", function () {
      var cityName = this.textContent
      getCityWeather(cityName);

    })

  }

}

// Fetch weather data
function getCityWeather(cityName) {

  var currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=15b3aa0f567265f18ce1bd88486e5f83`
  fetch(currentWeatherAPI)
    .then(function (response) {
      return response.json()
    })
    .then(function (currentWeatherData) {

      // Fetch UV data
      var UVAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&units=imperial&appid=15b3aa0f567265f18ce1bd88486e5f83`

      fetch(UVAPI)
        .then(function (UVresponse) {
          return UVresponse.json()
        })
        .then(function (UVData) {
          console.log(UVData.current.uvi)
          var UVStatus = ""
          if ( UVData.current.uvi >=0 && UVData.current.uvi <=2 ) {
              UVStatus = "green"
          } else if ( UVData.current.uvi >2 && UVData.current.uvi <= 5 ) {
            UVStatus = "yellow"
          } else if ( UVData.current.uvi >5 && UVData.current.uvi <= 7 ) {
            UVStatus = "orange"
          } else if (UVData.current.uvi >7 && UVData.current.uvi <= 10 ) {
            UVStatus = "red"
          } else {
            UVStatus = "purple"
          }
          // Current Weather details that is showing on jumbotron based on the search
          textFrame.innerHTML = `
                    <h5><span>
    
                       ${currentWeatherData.name}(${moment(currentWeatherData.dt, "X").format("MM/DD/YYYY")})  
                   
                       <img class="image"  src="http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png"     /> 
                      
                  </span></h5>
    
                   <h6>Temp:${currentWeatherData.main.temp}</h6>
                   <h6>Wind:${currentWeatherData.wind.speed}</h6>
                   <h6>humidity:${currentWeatherData.main.humidity}</h6>
                   <h6>UV Index:<span class="${UVStatus}">${UVData.current.uvi}</span></h6>
                   `
// 5 day forecast
          flexBox.innerHTML = ""
          for (let i = 1; i < UVData.daily.length - 2; i++) {
            console.log(UVData.daily[i])
            console.log(moment(UVData.daily[i].dt, "X").format("MM/DD/YYYY"))

            flexBox.innerHTML = flexBox.innerHTML + `
                         <div class="col-card ">
                         <div class="card-panel grey lighten-2 cardStyle">
                           <div class="container">
                           <h5><span>
    
                           ${moment(UVData.daily[i].dt, "X").format("MM/DD/YYYY")}  
                       
                           <img class="image"  src="http://openweathermap.org/img/wn/${UVData.daily[i].weather[0].icon}.png"/> 
                      </span></h5>
        
                       <h6>Temp:${UVData.daily[i].temp.max}</h6>
                       <h6>Wind:${UVData.daily[i].wind_speed}</h6>
                       <h6>humidity:${UVData.daily[i].humidity}</h6>
                      </div>
                      </div>
                      </div>
                         `

          }

        })

    })

}

if (searchHistory.length > 0 ) {
  getCityWeather(searchHistory[searchHistory.length - 1]);
}


