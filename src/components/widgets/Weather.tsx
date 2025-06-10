import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_APIKEY;

// TypeScript interfaces for weather data
interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface CurrentWeather {
  cloud: number;
  condition: WeatherCondition;
  dewpoint_c: number;
  dewpoint_f: number;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  heatindex_c: number;
  heatindex_f: number;
  humidity: number;
  is_day: number;
  last_updated: string;
  last_updated_epoch: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  wind_degree: number;
  wind_dir: string;
  wind_kph: number;
  wind_mph: number;
  windchill_c: number;
  windchill_f: number;
}

interface WeatherResponse {
  location: Location;
  current: CurrentWeather;
}

export const Weather = () => {
  console.log("apiKey in Weather component:", apiKey);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Berlin`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data: WeatherResponse = await response.json();
        console.log("weather data in fetchWeather:", data);
        setWeather(data);
      } catch (err) {
        console.log("error in fetchWeather:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl w-80 h-48 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-white/30 rounded-full animate-spin border-2 border-white/20 border-t-white mx-auto mb-2"></div>
          <p className="text-sm opacity-80">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 text-white shadow-xl w-80 h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm opacity-90">Weather unavailable</p>
          <p className="text-xs opacity-70 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-6 text-white shadow-xl w-80 h-48 flex items-center justify-center">
        <p className="text-sm opacity-80">No weather data available</p>
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
      className={`bg-gradient-to-br ${getWeatherGradient()} rounded-2xl p-6 text-white shadow-xl w-80 min-h-48 backdrop-blur-sm absolute top-20 left-10`}
    >
      {/* Header with location */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{location.name}</h2>
          <p className="text-sm opacity-80">{location.country}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70">
            {new Date(current.last_updated).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={`https:${current.condition.icon}`}
            alt={current.condition.text}
            className="w-16 h-16 mr-3"
          />
          <div>
            <div className="text-4xl font-light">
              {Math.round(current.temp_c)}°
            </div>
            <p className="text-sm opacity-90">{current.condition.text}</p>
          </div>
        </div>
      </div>

      {/* Additional weather details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="opacity-80">Feels like</span>
            <span className="font-medium">
              {Math.round(current.feelslike_c)}°C
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Humidity</span>
            <span className="font-medium">{current.humidity}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="opacity-80">Wind</span>
            <span className="font-medium">
              {Math.round(current.wind_kph)} km/h
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">UV Index</span>
            <span className="font-medium">{current.uv}</span>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>Pressure: {current.pressure_mb} mb</span>
          <span>Visibility: {current.vis_km} km</span>
        </div>
      </div>
    </div>
  );
};
