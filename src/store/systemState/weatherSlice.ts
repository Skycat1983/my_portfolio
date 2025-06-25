import type { SetState } from "../../types/storeTypes";
import type { NewDesktopStore } from "../../hooks/useStore";

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

export const createWeatherSlice = (
  set: SetState<NewDesktopStore>
): WeatherSlice => ({
  weather: null,
  weatherLoading: false,
  weatherError: null,

  fetchWeather: async (location = "Berlin") => {
    console.log("fetchWeather in weatherSlice: fetching weather for", location);

    try {
      set({ weatherLoading: true, weatherError: null });

      const response = await fetch(
        // `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
      );

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
