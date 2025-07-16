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
import { Columns3, Grid2x2, List } from "lucide-react";
import type { WindowId } from "@/constants/applicationRegistry";
import theme from "@/styles/theme";

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
  windowId: WindowId;
}

export const Settings = ({ windowId }: SettingsProps) => {
  // Split store access into smaller pieces
  const timeFormat = useNewStore((state) => state.timeFormat);
  const setTimeFormat = useNewStore((state) => state.setTimeFormat);
  const currentTheme = useNewStore((state) => state.theme);
  const toggleTheme = useNewStore((state) => state.toggleTheme);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);
  const toggleWifi = useNewStore((state) => state.toggleWifi);
  const selectedCity = useNewStore((state) => state.selectedCity);
  const setSelectedCity = useNewStore((state) => state.setSelectedCity);
  const setTimezone = useNewStore((state) => state.setTimezone);
  const setCustomWallpaper = useNewStore((state) => state.setCustomWallpaper);
  const fetchWeather = useNewStore((state) => state.weather.fetchWeather);
  const window = useNewStore((state) => state.findWindowById(windowId));
  const zIndex = window?.zIndex ?? 0;
  const defaultFinderView = useNewStore((state) => state.defaultFinderView);
  const setDefaultFinderView = useNewStore(
    (state) => state.setDefaultFinderView
  );

  // Theme colors
  const bgColorPrimary = theme.colors[currentTheme].background.primary;
  const bgColorSecondary = theme.colors[currentTheme].background.secondary;
  const bgColorTertiary = theme.colors[currentTheme].background.tertiary;
  const textColorPrimary = theme.colors[currentTheme].text.primary;
  const borderColor = theme.colors[currentTheme].border.primary;
  const surfaceColor = theme.colors[currentTheme].surface.primary;

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

  const getButtonStyles = (isActive: boolean) => ({
    backgroundColor: isActive
      ? theme.colors.status.info[currentTheme]
      : bgColorSecondary,
    color: isActive ? "#ffffff" : textColorPrimary,
    borderColor: borderColor,
  });

  return (
    <div
      className="h-auto w-full"
      style={{
        backgroundColor: bgColorPrimary,
        color: textColorPrimary,
      }}
    >
      <div className="p-8 space-y-6 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: textColorPrimary }}
        >
          System Settings
        </h1>

        {/* Time & Location Settings Section */}
        <div
          className="p-6 rounded-lg border space-y-4"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Time & Location Settings
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: textColorPrimary }}>Time Format</Label>
              <Select
                value={timeFormat}
                onValueChange={(value: "12h" | "24h") => setTimeFormat(value)}
              >
                <SelectTrigger
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    color: textColorPrimary,
                    zIndex: zIndex + 1,
                  }}
                >
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: zIndex + 1,
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    color: textColorPrimary,
                  }}
                >
                  <SelectItem value="12h" style={{ color: textColorPrimary }}>
                    12-hour
                  </SelectItem>
                  <SelectItem value="24h" style={{ color: textColorPrimary }}>
                    24-hour
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label style={{ color: textColorPrimary }}>City</Label>
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    color: textColorPrimary,
                    zIndex: zIndex + 1,
                  }}
                >
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: zIndex + 1,
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    color: textColorPrimary,
                  }}
                >
                  {CITIES.map((city) => (
                    <SelectItem
                      key={city.name}
                      value={city.name}
                      style={{ color: textColorPrimary }}
                    >
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Finder Settings Section */}
        <div
          className="p-6 rounded-lg border space-y-4"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Finder Settings
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: textColorPrimary }}>
                Default Finder View
              </Label>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex flex-col items-center justify-center h-20 w-20 border"
                  style={getButtonStyles(defaultFinderView === "icons")}
                  onClick={() => setDefaultFinderView("icons")}
                >
                  <Grid2x2 className="size-5 mb-1" />
                  <span className="text-xs">Icons</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex flex-col items-center justify-center h-20 w-20 border"
                  style={getButtonStyles(defaultFinderView === "list")}
                  onClick={() => setDefaultFinderView("list")}
                >
                  <List className="size-5 mb-1" />
                  <span className="text-xs">List</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex flex-col items-center justify-center h-20 w-20 border"
                  style={getButtonStyles(defaultFinderView === "columns")}
                  onClick={() => setDefaultFinderView("columns")}
                >
                  <Columns3 className="size-5 mb-1" />
                  <span className="text-xs">Columns</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div
          className="p-6 rounded-lg border space-y-4"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Theme Settings
          </h2>
          <div className="flex items-center justify-between py-2">
            <Label className="text-base" style={{ color: textColorPrimary }}>
              Dark Mode
            </Label>
            <Switch
              checked={currentTheme === "dark"}
              onCheckedChange={toggleTheme}
              style={{
                backgroundColor: bgColorTertiary,
              }}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>

        {/* Network Settings Section */}
        <div
          className="p-6 rounded-lg border space-y-4"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Network Settings
          </h2>
          <div className="flex items-center justify-between py-2">
            <Label className="text-base" style={{ color: textColorPrimary }}>
              WiFi
            </Label>
            <Switch
              checked={wifiEnabled}
              onCheckedChange={toggleWifi}
              style={{
                backgroundColor: bgColorTertiary,
              }}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>

        {/* Wallpaper Settings Section */}
        <div
          className="p-6 rounded-lg border space-y-4"
          style={{
            backgroundColor: bgColorSecondary,
            borderColor: borderColor,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColorPrimary }}
          >
            Wallpaper Settings
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: textColorPrimary }}>
                Custom Wallpaper
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="flex-1 p-2 rounded-md border"
                  style={{
                    backgroundColor: surfaceColor,
                    color: textColorPrimary,
                    borderColor: borderColor,
                  }}
                />
                <Button
                  onClick={handleRemoveWallpaper}
                  variant="destructive"
                  style={{
                    backgroundColor: theme.colors.status.error[currentTheme],
                    color: "#ffffff",
                  }}
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
