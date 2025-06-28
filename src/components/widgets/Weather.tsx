import { useEffect } from "react";
import { useNewStore } from "../../hooks/useStore";

export const Weather = () => {
  const { weather, weatherLoading, weatherError, fetchWeather } = useNewStore();

  useEffect(() => {
    console.log("Weather useEffect: checking if weather data exists", {
      weather,
      weatherLoading,
      weatherError,
    });

    // Only fetch if no weather data, not loading, and no error
    if (!weather && !weatherLoading && !weatherError) {
      console.log("Weather useEffect: fetching weather data");
      fetchWeather();
    }
  }, [weather, weatherLoading, weatherError, fetchWeather]);

  if (weatherLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-xl w-full h-full min-h-32 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white/30 rounded-full animate-spin border-2 border-white/20 border-t-white mx-auto mb-2"></div>
          <p className="text-xs md:text-sm opacity-80">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-4 md:p-6 text-white shadow-xl w-full h-full min-h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl md:text-3xl mb-2">⚠️</div>
          <p className="text-xs md:text-sm opacity-90">Weather unavailable</p>
          <p className="text-xs opacity-70 mt-1 hidden md:block">
            {weatherError}
          </p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-4 md:p-6 text-white shadow-xl w-full h-full min-h-32 flex items-center justify-center">
        <p className="text-xs md:text-sm opacity-80">
          No weather data available
        </p>
      </div>
    );
  }

  const { current, location } = weather;

  // Determine background gradient based on weather condition and time of day
  const getWeatherGradient = () => {
    const isDay = current.is_day === 1;
    const condition = current.condition.text.toLowerCase();

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return isDay
        ? "from-slate-400 to-slate-600"
        : "from-slate-600 to-slate-800";
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return isDay ? "from-gray-400 to-gray-600" : "from-gray-600 to-gray-800";
    } else if (condition.includes("clear") || condition.includes("sunny")) {
      return isDay
        ? "from-blue-400 to-blue-600"
        : "from-indigo-600 to-purple-800";
    } else {
      return isDay
        ? "from-sky-400 to-sky-600"
        : "from-indigo-600 to-indigo-800";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getWeatherGradient()} rounded-2xl p-4 md:p-6 text-white shadow-xl w-full h-full min-h-48 backdrop-blur-sm flex flex-col`}
    >
      {/* Header with location */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-semibold truncate">
            {location.name}
          </h2>
          <p className="text-xs md:text-sm opacity-80 truncate">
            {location.country}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-xs opacity-70">
            {new Date(current.last_updated).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center mb-3 md:mb-4 flex-1 min-h-0">
        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
          className="w-12 h-12 md:w-16 md:h-16 mr-3 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-3xl md:text-4xl font-light leading-none">
            {Math.round(current.temp_c)}°
          </div>
          <p className="text-xs md:text-sm opacity-90 truncate">
            {current.condition.text}
          </p>
        </div>
      </div>

      {/* Additional weather details */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm flex-shrink-0">
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between">
            <span className="opacity-80 truncate">Feels like</span>
            <span className="font-medium flex-shrink-0 ml-1">
              {Math.round(current.feelslike_c)}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Humidity</span>
            <span className="font-medium flex-shrink-0 ml-1">
              {current.humidity}%
            </span>
          </div>
        </div>
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between">
            <span className="opacity-80">Wind</span>
            <span className="font-medium flex-shrink-0 ml-1">
              {Math.round(current.wind_kph)} km/h
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">UV</span>
            <span className="font-medium flex-shrink-0 ml-1">{current.uv}</span>
          </div>
        </div>
      </div>

      {/* Bottom info - hidden on very small screens */}
      <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-white/20 hidden sm:block flex-shrink-0">
        <div className="flex justify-between items-center text-xs opacity-70">
          <span className="truncate">Pressure: {current.pressure_mb} mb</span>
          <span className="truncate ml-2">Visibility: {current.vis_km} km</span>
        </div>
      </div>
    </div>
  );
};
