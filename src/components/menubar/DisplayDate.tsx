import { useEffect, useState } from "react";
import { useNewStore } from "@/hooks/useStore";

export const DisplayDate = () => {
  const [date, setDate] = useState(new Date());
  const timeFormat = useNewStore((s) => s.timeFormat);
  const timezone = useNewStore((s) => s.timezone);

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = date
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: timezone || "UTC",
    })
    .replace(/,/g, "");

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: timeFormat === "12h",
    timeZone: timezone || "UTC",
  });

  return (
    <div>
      <p className="text-white font-mono tabular-nums">
        {formattedDate} {formattedTime}
      </p>
    </div>
  );
};
