import './App.css';
import React from 'react';
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
//import getWeatherData from './services/weatherService';
import getFormattedWeatherData from './services/weatherService';
import { useState } from 'react';
import { useEffect } from 'react';
  

function App() {

  const [query, setQuery] = useState({q: 'berlin'});
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() =>{
    const fetchWeather = async () => {
      try {
        const data = await getFormattedWeatherData({ ...query, units });
        setWeather(data);
        speakWeatherData(data);
        setErrorMessage(null); // Clear any previous errors
      } catch (error) {
        setWeather(null);
        setErrorMessage("City not found. Please enter a valid city.");
      }
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () =>{
    if(!weather) return "from-blue-700 to-purple-700";
    const threshold = units === "metric"?20:60;
    if(weather.temp <=threshold) return "from-blue-600 to-purple-600";
    return "from-yellow-600 to-rose-700";
  };

  const speakWeatherData = (data) => {
    const { name, temp } = data;
    const unit = units === 'metric' ? 'degrees Celsius' : 'degrees Fahrenheit';
    const message = `The temperature in ${name} is ${temp.toFixed()} ${unit}.`;

    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      synthesis.speak(utterance);
    }
  };


  return (
    <div className={`py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>
      
      <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gray-700/20 shadow-xl shadow-gray-500  h-fit`}>
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {weather && (
        <div>
        <TimeAndLocation weather={weather}/>
        <TemperatureAndDetails weather={weather}/>
        <Forecast title = "hourly forecast" items={weather.hourly}/>
        <Forecast title = "daily forecast" items={weather.daily}/>
        </div>
      )}
    </div>
    </div>
    
  );
}

export default App;