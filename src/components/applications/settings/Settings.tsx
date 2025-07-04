import { useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

// List of major cities with their timezones
const CITIES = [
  { name: "London", timezone: "Europe/London" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "Berlin", timezone: "Europe/Berlin" },
  { name: "Madrid", timezone: "Europe/Madrid" },
  { name: "Rome", timezone: "Europe/Rome" },
  { name: "Amsterdam", timezone: "Europe/Amsterdam" },
  { name: "Brussels", timezone: "Europe/Brussels" },
  { name: "Vienna", timezone: "Europe/Vienna" },
  { name: "Copenhagen", timezone: "Europe/Copenhagen" },
  { name: "Stockholm", timezone: "Europe/Stockholm" },
  { name: "Oslo", timezone: "Europe/Oslo" },
  { name: "Helsinki", timezone: "Europe/Helsinki" },
  { name: "Moscow", timezone: "Europe/Moscow" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Beijing", timezone: "Asia/Shanghai" },
  { name: "Seoul", timezone: "Asia/Seoul" },
  { name: "Singapore", timezone: "Asia/Singapore" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Wellington", timezone: "Pacific/Auckland" },
  { name: "New York", timezone: "America/New_York" },
  { name: "Los Angeles", timezone: "America/Los_Angeles" },
  { name: "Chicago", timezone: "America/Chicago" },
  { name: "Toronto", timezone: "America/Toronto" },
  { name: "Mexico City", timezone: "America/Mexico_City" },
  { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
  { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires" },
  { name: "Cairo", timezone: "Africa/Cairo" },
  { name: "Dubai", timezone: "Asia/Dubai" },
  { name: "Mumbai", timezone: "Asia/Kolkata" },
  { name: "Bangkok", timezone: "Asia/Bangkok" },
];

interface SettingsProps {
  windowId: string;
}

export const Settings = ({ windowId }: SettingsProps) => {
  // Split store access into smaller pieces
  const timeFormat = useNewStore((state) => state.timeFormat);
  const setTimeFormat = useNewStore((state) => state.setTimeFormat);
  const theme = useNewStore((state) => state.theme);
  const toggleTheme = useNewStore((state) => state.toggleTheme);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const toggleWifi = useNewStore((state) => state.toggleWifi);
  const selectedCity = useNewStore((state) => state.selectedCity);
  const setSelectedCity = useNewStore((state) => state.setSelectedCity);
  const setTimezone = useNewStore((state) => state.setTimezone);
  const setCustomWallpaper = useNewStore((state) => state.setCustomWallpaper);
  const fetchWeather = useNewStore((state) => state.fetchWeather);
  const window = useNewStore((state) => state.getWindowById(windowId));
  const zIndex = window?.zIndex ?? 0;

  // Memoize handlers
  const handleCityChange = useCallback(
    async (cityName: string) => {
      const city = CITIES.find((c) => c.name === cityName);
      if (city) {
        setSelectedCity(city.name);
        setTimezone(city.timezone);
        await fetchWeather(city.name);
      }
    },
    [setSelectedCity, setTimezone, fetchWeather]
  );

  const handleWallpaperUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCustomWallpaper(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setCustomWallpaper]
  );

  const handleRemoveWallpaper = useCallback(() => {
    setCustomWallpaper(null);
  }, [setCustomWallpaper]);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-neutral-900" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const sectionBgColor = isDark ? "bg-neutral-800" : "bg-neutral-100";
  const borderColor = isDark ? "border-neutral-700" : "border-neutral-200";

  return (
    <div className={`h-full w-full ${bgColor} ${textColor}`}>
      <div className="p-8 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Settings</h1>

        {/* Time & Location Settings Section */}
        <div
          className={`p-6 rounded-lg ${sectionBgColor} ${borderColor} border space-y-4`}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Time & Location Settings
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select
                value={timeFormat}
                onValueChange={(value: "12h" | "24h") => setTimeFormat(value)}
              >
                <SelectTrigger
                  className={`${
                    isDark
                      ? "bg-neutral-700 border-neutral-600"
                      : "bg-white border-neutral-300"
                  }`}
                  style={{ zIndex: zIndex + 1 }}
                >
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent
                  style={{ zIndex: zIndex + 1 }}
                  className={isDark ? "bg-neutral-700" : "bg-white"}
                >
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger
                  className={`${
                    isDark
                      ? "bg-neutral-700 border-neutral-600"
                      : "bg-white border-neutral-300"
                  }`}
                  style={{ zIndex: zIndex + 1 }}
                >
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent
                  style={{ zIndex: zIndex + 1 }}
                  className={isDark ? "bg-neutral-700" : "bg-white"}
                >
                  {CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div
          className={`p-6 rounded-lg ${sectionBgColor} ${borderColor} border space-y-4`}
        >
          <h2 className="text-2xl font-semibold mb-4">Theme Settings</h2>
          <div className="flex items-center justify-between py-2">
            <Label className="text-base">Dark Mode</Label>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              className={`${
                isDark ? "bg-neutral-600" : "bg-neutral-300"
              } data-[state=checked]:bg-blue-600`}
            />
          </div>
        </div>

        {/* Network Settings Section */}
        <div
          className={`p-6 rounded-lg ${sectionBgColor} ${borderColor} border space-y-4`}
        >
          <h2 className="text-2xl font-semibold mb-4">Network Settings</h2>
          <div className="flex items-center justify-between py-2">
            <Label className="text-base">WiFi</Label>
            <Switch
              checked={wifiEnabled}
              onCheckedChange={toggleWifi}
              className={`${
                isDark ? "bg-neutral-600" : "bg-neutral-300"
              } data-[state=checked]:bg-blue-600`}
            />
          </div>
        </div>

        {/* Wallpaper Settings Section */}
        <div
          className={`p-6 rounded-lg ${sectionBgColor} ${borderColor} border space-y-4`}
        >
          <h2 className="text-2xl font-semibold mb-4">Wallpaper Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Wallpaper</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className={`flex-1 p-2 rounded-md ${
                    isDark ? "bg-neutral-700 text-white" : "bg-white text-black"
                  } ${borderColor} border`}
                />
                <Button
                  onClick={handleRemoveWallpaper}
                  variant={isDark ? "destructive" : "secondary"}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
