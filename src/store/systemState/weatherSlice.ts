import type { SetState } from "@/types/storeTypes";
import type { NewDesktopStore } from "@/hooks/useStore";

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

export interface WeatherSlice {
  weather: WeatherResponse | null;
  weatherLoading: boolean;
  weatherError: string | null;
  fetchWeather: (location?: string) => Promise<void>;
  clearWeatherError: () => void;
}

// TODO: get last 7 days of weather data for a location
// TODO: change weather location

export const createWeatherSlice = (
  set: SetState<NewDesktopStore>
): WeatherSlice => ({
  weather: null,
  weatherLoading: false,
  weatherError: null,

  fetchWeather: async (location = "Berlin") => {
    console.log("fetchWeather in weatherSlice: fetching weather for", location);
    console.log(
      "fetchWeather in weatherSlice: API key is",
      apiKey ? "defined" : "undefined"
    );

    // Check if API key exists
    if (!apiKey || apiKey === "undefined") {
      console.log(
        "fetchWeather in weatherSlice: API key not found or undefined"
      );
      set({
        weatherError: "Weather API key not configured",
        weatherLoading: false,
      });
      return;
    }

    try {
      set({ weatherLoading: true, weatherError: null });

      // ! get last 7 days of weather data for a location
      // compute ISO dates in YYYY-MM-DD
      // const today = new Date();
      // const endDate = today.toISOString().split("T")[0]; // e.g. "2025-06-28"
      // const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      //   .toISOString()
      //   .split("T")[0];

      // const historyRes = await fetch(
      //   `https://api.weatherapi.com/v1/history.json` +
      //     `?key=${apiKey}` +
      //     `&q=${location}` +
      //     `&dt=${startDate}` +
      //     `&end_dt=${endDate}`
      // );
      // const historyData = await historyRes.json();
      // console.log("fetchWeather in weatherSlice: history data", historyData);

      // ! get forecast for next 3 days for a location
      // const forecastRes = await fetch(
      //   `https://api.weatherapi.com/v1/forecast.json` +
      //     `?key=${apiKey}` +
      //     `&q=${location}` +
      //     `&days=3`
      // );
      // const forecastData = await forecastRes.json();
      // console.log("fetchWeather in weatherSlice: forecast data", forecastData);

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
      );
      console.log("fetchWeather in weatherSlice: response", response);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherResponse = await response.json();
      console.log("fetchWeather in weatherSlice: weather data fetched", data);

      set({ weather: data, weatherLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      console.log("fetchWeather in weatherSlice: error", errorMessage);

      set({
        weatherError: errorMessage,
        weatherLoading: false,
      });
    }
  },

  clearWeatherError: () => {
    console.log("clearWeatherError in weatherSlice: clearing error");
    set({ weatherError: null });
  },
});
