import CalendarWidget from "./CalendarWidget";
import DateWidget from "./DateWidget";
import { Weather } from "./Weather";

export const WidgetsLayout = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 md:grid-rows-2 gap-4 w-full h-1/3">
        {/* Calendar Widget - top left on desktop, hidden on mobile */}
        {/* <div className="hidden md:block md:col-start-1 md:row-start-1">
          <CalendarWidget />
        </div> */}

        {/* Date Widget - bottom left on desktop, hidden on mobile */}
        {/* <div className="hidden md:block md:col-start-1 md:row-start-2">
          <DateWidget />
        </div> */}

        {/* Weather Widget - right side on desktop, full width on mobile */}
        <div className="col-span-1 row-span-1 md:col-span-4 md:col-start-1 md:row-span-2">
          <Weather />
        </div>
      </div>
    </>
  );
};
