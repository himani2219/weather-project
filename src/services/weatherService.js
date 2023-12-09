import { DateTime } from "luxon";
//import axios from 'axios';

const API_KEY = '72590924c5e9e63d88fad6651ae13e55';
const BASE_URL = 'https://api.openweathermap.org/data';


const getWeatherData = (infoType, searchParams) =>{
    const url = new URL(BASE_URL + '/'+ infoType);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY});

    return fetch(url)
    .then((res)=> res.json())
    
};

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

    const {main: details, icon} = weather[0];
    return{lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, speed, details, icon };

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

    hourly = hourly.slice(1,6).map(d=>{
        return{
            title: formatToLocalTime(d.dt, timezone,'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon,
        };
        //console.log(timezone, daily, hourly);
    });

    return {timezone, daily, hourly};
            
};

const getFormattedWeatherData = async  (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('2.5/weather', searchParams).then(formatCurrentWeather);


    const {lat, lon}= formattedCurrentWeather;

     const formattedForecastWeather = await getWeatherData('3.0/onecall', {lat, lon, exclude: "current,minutely,alerts", units: searchParams.units}).then(formatForecastWeather);

 
    return { ...formattedCurrentWeather, ...formattedForecastWeather}; 
};

const formatToLocalTime = (secs, zone, format = "ccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export {formatToLocalTime, iconUrlFromCode};

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
