import { DateTime } from "luxon";
//import axios from 'axios';

const API_KEY = '72590924c5e9e63d88fad6651ae13e55';
// const BASE_URL1 = 'https://api.openweathermap.org/data/3.0';
// const BASE_URL2 = 'https://api.openweathermap.org/data/2.5';


// const getWeatherData1 = (infoType, searchParams) =>{
//     const url = new URL(BASE_URL1 + '/'+ infoType);
//     // const url2 = new URL(BASE_URL2 + '/'+ infoType);
//     url.search = new URLSearchParams({...searchParams, appid:API_KEY});

//     return fetch(url)
//     .then((res)=> res.json())
    
// };

// const getWeatherData2 = (infoType, searchParams) =>{
//     const url = new URL(BASE_URL2 + '/'+ infoType);
//     // const url2 = new URL(BASE_URL2 + '/'+ infoType);
//     url.search = new URLSearchParams({...searchParams, appid:API_KEY});

//     return fetch(url)
//     .then((res)=> res.json())
    
// };

const formatCurrentWeather = (data) =>{
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys:{country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data

    const {main: details, icon} = weather[0]
    return{lat, lon, dt, temp, feels_like, temp_min, temp_max, humidity, name, country, sunrise, sunset, speed, details, icon };

};



const formatForecastWeather = (data)=>{
    let {timezone, daily, hourly} = data; 
    daily = daily.slice(1,6).map(d=>{
        return{
            title: formatToLocalTime(d.dt, timezone,'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    });

    hourly = hourly.slice(1,6).map(h=>{
        return{
            title: formatToLocalTime(h.dt, timezone,'hh:mm a'),
            temp: h.temp.day,
            icon: h.weather[0].icon
        }
    });

    return {timezone, daily, hourly};
            
};

const getFormattedWeatherData = async  (searchParams) => {
    //const formattedCurrentWeather = await getWeatherData2('weather', searchParams).then(formatCurrentWeather);

    const formattedCurrentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=${API_KEY}`)
    .then((res)=> res.json()).then(formatCurrentWeather);



    const{lat, lon}= formatCurrentWeather;

     //const formattedForecastWeather = await getWeatherData1('onecall', {lat, lon, exclude: "current,minutely,alerts", units:searchParams.units}).then(formatForecastWeather);

    const formattedForecastWeather = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&${lon}=2.3488&exclude=currently,minutely,alerts&appid=${API_KEY}`)
    .then((res)=> res.json()).then(formatForecastWeather);
 
    return { ...formattedCurrentWeather, ...formattedForecastWeather}; 
};

const formatToLocalTime = (secs, zone, format = "ccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

//export default getFormattedWeatherData

// const formatCurrentWeather = (data) => {
//     const {
//         lat,
//         lon,
//         current,
//     } = data;

//     if (!current) {
//         console.error('Error: "current" property not found in data.');
//         return null; // or handle the error in a way that makes sense for your application
//     }

//     const {
//         dt,
//         temp,
//         feels_like,
//         humidity,
//         sunrise,
//         sunset,
//         wind_speed,
//         weather,
//     } = current;

//     if (!dt) {
//         console.error('Error: "dt" property not found in current weather data.');
//         return null; // or handle the error in a way that makes sense for your application
//     }

//     const { main, icon } = weather[0];

//     return { lat, lon, dt, temp, feels_like, humidity, sunrise, sunset, wind_speed, main, icon };
// };
