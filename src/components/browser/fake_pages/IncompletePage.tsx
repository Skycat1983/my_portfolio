import { AlertCircle } from "lucide-react";
import { useNewStore } from "../../../hooks/useStore";

export const IncompletePage = () => {
  const { lastNavigatedUrl } = useNewStore();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-8">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Incomplete URL
        </h1>
        <p className="text-gray-600 mb-4">
          You've entered:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {lastNavigatedUrl}
          </span>
        </p>
        <p className="text-gray-600 mb-6">
          Does{" "}
          <span className="font-mono text-blue-600">{lastNavigatedUrl}</span>{" "}
          look like a valid address to you? <br />
          {/* <span className="font-mono text-blue-600">{predefinedAddress}</span> */}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Keep typing any characters to complete the
            URL, or press Enter again to try a different address.
          </p>
        </div>
      </div>
    </div>
  );
};
