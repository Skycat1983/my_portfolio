import { WARNING } from "../../../../constants/images";

interface ErrorModalProps {
  operatingSystem: "windows" | "macos";
  onClose: () => void;
}

export const ErrorModal = ({ operatingSystem, onClose }: ErrorModalProps) => {
  const company = operatingSystem === "windows" ? "Microsoft" : "Apple";
  const message =
    operatingSystem === "windows"
      ? "GTAVI.exe has stopped working"
      : "GTAVI quit unexpectedly";

  const buttonText = operatingSystem === "windows" ? "Close" : "Ignore";

  return (
    <div
      className="bg-gray-500 rounded-lg shadow-xl w-80"
      style={{
        background: "linear-gradient(145deg, #6b7280 0%, #4b5563 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="relative p-6 text-center">
        {/* Warning triangle - more prominent */}
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            <img src={WARNING} alt="Warning" className="w-full h-full" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">{message}</h3>

        <p className="text-sm text-gray-200 mb-6 leading-relaxed px-2">
          Click Ignore to exit. Click Report to send a detailed crash report to{" "}
          {company}.
        </p>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-400 bg-opacity-30 text-white rounded-lg text-sm font-medium hover:bg-gray-300 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors border border-cyan-400"
          >
            {buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-400 bg-opacity-50 text-white rounded-lg text-sm font-medium hover:bg-gray-300 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
};
