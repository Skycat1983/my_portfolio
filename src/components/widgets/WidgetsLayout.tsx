import CalendarWidget from "./CalendarWidget";
import { Weather } from "./WeatherWidget";
import { useNewStore } from "../../hooks/useStore";

const WidgetsLayout = () => {
  return (
    <>
      <div className="bg-red-100/10 flex flex-row md:flex-col gap-4">
        <Weather />
        <div className="hidden sm:flex w-full">
          <CalendarWidget />
        </div>
      </div>
    </>
  );
};

export const Widgets = () => {
  const operatingSystem = useNewStore((s) => s.operatingSystem);

  const showWidgets = operatingSystem === "mac";

  return (
    <>
      {showWidgets && (
        <div className="hidden sm:block h-auto w-auto">
          <WidgetsLayout />
        </div>
      )}
      <div className="h-auto w-auto sm:hidden">
        <WidgetsLayout />
      </div>
    </>
  );
};
