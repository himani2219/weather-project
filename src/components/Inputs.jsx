import React from "react";
import {
  UilSearch,
  UilLocationPoint,
  UilMicrophone,
} from "@iconscout/react-unicons";
import { useState } from "react";
function Inputs({ setQuery, units, setUnits }) {
  const [city, setCity] = useState("");

  const handleUnitsChange = (e) => {
    const selectedUnit = e.currentTarget.name;
    if (units !== selectedUnit) setUnits(selectedUnit);
  };

  const handleVoiceSearch = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        "SpeechRecognition" in window
          ? window.SpeechRecognition
          : window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      // if ('webkitSpeechRecognition' in window) {
      //   const recognition = new webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();
      recognition.onresult = (event) => {
        setCity(event.results[0][0].transcript);
        recognition.stop();
        setQuery({ q: event.results[0][0].transcript });
      };
      recognition.onerror = (error) => {
        console.log("Error:", error);
      };
    } else {
      console.log(
        "Your browser does not support voice recognition. Please try Google Chrome."
      );
    }
  };

  const handleSearchClick = () => {
    if (city !== "") setQuery({ q: city });
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        setQuery({
          lat,
          lon,
        });
      });
    }
  };

  return (
    <div className="flex flex-row justify-center my-6 ">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          placeholder="search for city"
          className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize"
        ></input>
        <UilSearch
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <UilLocationPoint
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
        <UilMicrophone
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleVoiceSearch}
        />
      </div>
      <div className="flex flex-row w-1/4 items-center justify-center">
        <button
          name="metric"
          className="text-white font-light p-2 transition ease-out hover:scale-125"
          onClick={handleUnitsChange}
        >
          °C
        </button>
        <p className="text-bold text-white mx-1"> | </p>
        <button
          name="imperial"
          className="text-white font-light p-2 transition ease-out hover:scale-125 "
          onClick={handleUnitsChange}
        >
          °F
        </button>
      </div>
    </div>
  );
}

export default Inputs;
