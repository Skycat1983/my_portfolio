import { useNewStore } from "@/hooks/useStore";
import type { ConversationId } from "./types";
import { Lock, Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useEffect, useState } from "react";

export interface PhoneCallScreenProps {
  avatar: string;
  name: string;
  phoneNumber: string;
  conversationId: ConversationId;
  onHangUp: () => void;
  onPhoneCallEnd?: (conversationId: ConversationId) => void;
}

export const PhoneCallScreen: React.FC<PhoneCallScreenProps> = ({
  avatar,
  name,
  conversationId,
  onHangUp,
  onPhoneCallEnd,
}) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const wifiEnabled = useNewStore((state) => state.wifiEnabled);

  // Auto hang up after 3 seconds and handle wifi disconnection
  useEffect(() => {
    if (!wifiEnabled) {
      onHangUp();
      return;
    }

    const autoHangupTimer = setTimeout(() => {
      // Call AI response callback first (might be async)
      try {
        onPhoneCallEnd?.(conversationId);
      } catch (error) {
        console.error("Phone call end callback error:", error);
      }

      // Then end the call UI state
      onHangUp();
    }, 3000);

    return () => clearTimeout(autoHangupTimer);
  }, [wifiEnabled, onHangUp, onPhoneCallEnd, conversationId]);

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white py-3 px-4 flex items-center border-b border-gray-700 justify-between">
        <div className="flex items-center gap-2">
          <Lock />
          <h2 className="font-semibold">End-to-End Encrypted</h2>
        </div>
        <div />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Name and Timer */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-semibold mb-2 text-white">{name}</h1>
          <p className="text-lg text-gray-300">{formatTime(callDuration)}</p>
        </div>

        {/* Avatar - centered in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gray-600 flex items-center justify-center">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Footer - fixed at bottom */}
      <div className="bg-gray-900 text-white py-8 px-4 flex items-center border-t border-gray-700 justify-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className="text-gray-300 hover:text-white transition-colors p-3 rounded-full hover:bg-gray-700"
            aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={() => setVideoEnabled(!videoEnabled)}
            className="text-gray-300 hover:text-white transition-colors p-3 rounded-full hover:bg-gray-700"
            aria-label={videoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={onHangUp}
            className="text-white transition-colors p-3 rounded-full hover:bg-red-600 bg-red-500"
            aria-label="Hang up"
          >
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{
                rotate: "135deg",
              }}
            >
              <Phone size={24} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
