import { useEffect, useState } from "react";

export const DisplayDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = date
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replace(/,/g, "");

  return (
    <div>
      <p className="text-white font-mono tabular-nums">
        {formattedDate} {date.toLocaleTimeString()}
      </p>
    </div>
  );
};
