async function getWeatherInfo(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,apparent_temperature_max,apparent_temperature_min&timezone=auto`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // Specific HTTP error types
            if (response.status === 400) {
                throw new Error('INVALID_COORDINATES'); // Custom error code
            }
            else if (response.status === 429) {
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            else if (response.status >= 500) {
                throw new Error('SERVER_ERROR');
            }
            else {
                throw new Error(`HTTP_ERROR_${response.status}`);
            }
        }
        
        return await response.json();
    }
    catch(error) {
        if (error.message.includes('_')) {
        throw error; // Our error codes all have underscores
    }
        else {
            throw new Error('NETWORK_ERROR');
    }
    }
}

async function coordinateButtonListener(){
    const coordinatesButton = document.getElementById("coordinatesButton");
    const latitudeInput = document.getElementById("latitudeInput");
    const longitudeInput = document.getElementById("longitudeInput");
    let latitude =  latitudeInput.value.trim();
    let longitude = longitudeInput.value.trim();
    let weatherInfo = undefined;
    coordinatesButton.disabled = true;
    if (latitude.length === 0 || longitude.length === 0){
        window.alert("Cannot input a blank space");
    }
    else if (Number.isNaN(Number(longitude)) || Number.isNaN(Number(latitude))){
        window.alert("Invalid Input");
    }
    else if((latitude < -90 || latitude > 90) || ( longitude < -180 ||longitude > 180)){
        window.alert("Out of Bounds");
    }
    else{
        try{
            weatherInfo = await getWeatherInfo(latitude, longitude);
            }
            catch(error){
                let userMessage = '';
                switch(error.message) {
                    case 'INVALID_COORDINATES':
                        userMessage = 'Invalid coordinates. Please check your input.';
                        break;
                    case 'RATE_LIMIT_EXCEEDED':
                        userMessage = 'Too many requests. Please wait a moment.';
                        break;
                    case 'NETWORK_ERROR':
                        userMessage = 'Connection failed. Check your internet.';
                        break;
                    case 'SERVER_ERROR':
                        userMessage = 'Weather service is down. Try again later.';
                        break;
                    default:
                        userMessage = `Error: ${error.message}`;
                    }
                window.alert(userMessage);
                console.error('Weather fetch error:', error); 
                weatherInfo = null;
    }
    }
    coordinatesButton.disabled = false;
    latitudeInput.value = "";
    longitudeInput.value = "";
    showInformation(weatherInfo);
}

function showInformation(weatherInfo){
    const timeZone = document.getElementById("timezone");
    const tempForecast = document.getElementById("tempForecast");
    if (!weatherInfo){
        timeZone.textContent ="";
        tempForecast.textContent = "";
    }
    else{
        let temperatureType = weatherInfo.daily_units["apparent_temperature_max"];
        let totalString = "";
        timeZone.textContent = weatherInfo.timezone;
        for(let x = 0; x<weatherInfo.daily.time.length; x++){
            totalString += `${weatherInfo.daily.time[x]}
            \nMax Temperature: ${weatherInfo.daily.apparent_temperature_max[x]}${temperatureType}
            \nMin Temperature: ${weatherInfo.daily.apparent_temperature_min[x]}${temperatureType}
            \nWeather Code: ${checkWeatherCode(weatherInfo.daily["weather_code"][x])}\n\n`;
        }
        tempForecast.textContent = totalString;
    }
}

function checkWeatherCode(code){
    if (code >= 0 && code <= 29){
        return "Miscellaneous phenomena";
    }
    else if(code >= 30 && code <= 39){
        return "Dust Storms";
    }
    else if(code >= 40 && code <= 49){
        return "Ice Storms";
    }
    else if(code >= 50 && code <= 79){
        return "Rain";
    }
    else if(code >= 80 && code <= 99){
        return "Thunderstorm";
    }
    else{
        return "Invalid code";
    }
    
}

async function main(){
    const coordinatesButton = document.getElementById("coordinatesButton");
    coordinatesButton.addEventListener('click', coordinateButtonListener);
}
main();