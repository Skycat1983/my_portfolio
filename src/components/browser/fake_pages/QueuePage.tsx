import { useState, useEffect } from "react";
import { Clock, Users, Server, Wifi, AlertTriangle } from "lucide-react";
import { useNewStore } from "../../../hooks/useStore";

export const QueuePage = () => {
  const { predefinedAddress } = useNewStore();

  const [queuePosition] = useState("NaN.1.018e27");
  const [serverLoad, setServerLoad] = useState(99.7);
  const [dots, setDots] = useState("");
  const INITIAL_COUNTDOWN = 14 * 24 * 60 * 60 + 9 * 60 * 60 + 27 * 60;

  const [remainingSecs, setRemainingSecs] = useState(INITIAL_COUNTDOWN);

  const formatWaitTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer - decrements every minute (60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSecs((prev) => {
        if (prev <= 60) return INITIAL_COUNTDOWN; // Reset when it reaches 0
        return prev - 60; // Subtract 60 seconds (1 minute)
      });
    }, 60000); // Update every minute (60000ms)

    return () => clearInterval(interval);
  }, [INITIAL_COUNTDOWN]);

  // Simulate changing server load
  useEffect(() => {
    const interval = setInterval(() => {
      setServerLoad(99.1 + Math.random() * 0.8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main queue notice */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-8 text-center">
        <div className="animate-pulse">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        </div>
        <h1 className="text-3xl font-bold text-red-900 mb-4">
          High Traffic Alert
        </h1>
        <p className="text-lg text-red-700 mb-2">
          Due to extremely high demand, you have been placed in a queue
        </p>
        <p className="text-sm text-red-600 font-mono">
          Accessing:{" "}
          <span className="bg-red-100 px-2 py-1 rounded">
            {predefinedAddress}
          </span>
        </p>
      </div>

      {/* Queue status grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Queue position */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Your Position
            </h3>
          </div>
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
              #{queuePosition}
            </div>
            <p className="text-sm text-gray-600">in queue</p>
          </div>
        </div>

        {/* Estimated wait time */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Est. Wait Time
            </h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-orange-600 mb-2">
              {formatWaitTime(remainingSecs)}
            </div>
            <p className="text-sm text-gray-600">remaining</p>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          System Status
        </h3>

        <div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
          <div>
            <div className="text-green-400 mb-1">◉ CONN_STATUS: ACTIVE</div>
            <div className="text-blue-400 mb-1">
              ◉ THREAD_POOL: {Math.floor(Math.random() * 256)}/256
            </div>
            <div className="text-yellow-400">
              ◉ LOAD_AVG: {serverLoad.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="text-purple-400 mb-1">
              ◉ MEM_USAGE: 97.{Math.floor(Math.random() * 9)}%
            </div>
            <div className="text-cyan-400 mb-1">
              ◉ NET_LAT: {Math.floor(Math.random() * 50) + 200}ms
            </div>
            <div className="text-orange-400">
              ◉ CPU_TEMP: 78.{Math.floor(Math.random() * 9)}°C
            </div>
          </div>

          <div>
            <div className="text-red-400 mb-1">
              ◉ ERR_RATE: 0.{Math.floor(Math.random() * 9)}%
            </div>
            <div className="text-green-400 mb-1">◉ UPTIME: 847:32:18</div>
            <div className="text-blue-400">
              ◉ PROC_Q: {Math.floor(Math.random() * 999) + 1000}
            </div>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      <div className="text-center bg-gray-100 rounded-lg p-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Wifi className="w-8 h-8 text-blue-500 animate-pulse" />
          <div className="text-xl font-semibold text-gray-700">
            Connecting{dots}
          </div>
        </div>

        <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full animate-pulse"
            style={{ width: "23%" }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Please do not refresh or close this page
        </p>
        <p className="text-xs text-gray-500">
          Session ID: 0x{Math.random().toString(16).substr(2, 8).toUpperCase()}-
          {Math.random().toString(16).substr(2, 4).toUpperCase()}
        </p>
      </div>

      {/* Info box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          Why am I seeing this?
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• The site is experiencing unprecedented traffic</li>
          <li>• Queue system ensures fair access for all users</li>
          <li>• Your position is guaranteed - please wait</li>
          <li>• Estimated times are calculated dynamically</li>
        </ul>
      </div>
    </div>
  );
};
