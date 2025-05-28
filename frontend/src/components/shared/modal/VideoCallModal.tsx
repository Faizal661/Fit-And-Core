import { useEffect, useRef, useState } from "react";
import { useVideoCall } from "../../../hooks/useVideoCall";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface VideoCallModalProps {
  bookingId: string;
  userId: string;
  userType: "trainer" | "trainee";
  onClose: () => void;
}

export const VideoCallModal = ({
  bookingId,
  userId,
  userType,
  onClose,
}: VideoCallModalProps) => {
  const { localStream, remoteStream, isCallActive, startCall, endCall } =
    useVideoCall(bookingId, userId, userType);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [fullView, setFullView] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(()=>{
    startCall()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleView = () => {
    setFullView(!fullView);
  };

  const handleStartCall = async () => {
    await startCall();
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-75 flex items-center justify-center z-50 h-screen">
      <div className="w-full max-w-7xl h-[80vh] flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-300">
            Video Call Session
          </h2>
          <button
            onClick={handleEndCall}
            className="text-slate-300 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 relative">
          {/* Remote Stream (always full size) */}
          <div
            className={`
              absolute bg-black right-0  h-full rounded-lg  transition-all ease-in duration-300
               ${!fullView ? "w-[50%]" : "w-full"}
            `}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg bg-slate-700"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {userType === "trainer" ? "Trainee" : "Trainer"}
            </div>
            <button
              onClick={toggleView}
              className="absolute bottom-4 right-4 p-1 bg-gray-800/50 text-white rounded-full hover:bg-gray-700"
            >
              {fullView ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Local Stream - position changes based on fullView state */}
          <div
            className={`
              absolute bg-gray-500 rounded-lg overflow-hidden transition-all duration-300
              ${fullView ? "top-2 left-2 w-[26vh] h-[26vh] " : "w-[49%] h-full"}
            `}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover bg-slate-700"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>
        </div>

        <div className="p-4 pt-6 flex justify-center gap-4">
          {/* Media Control Buttons */}
          <button
            onClick={toggleMute}
            className={`p-2 text-white rounded-full ${
              isMuted
                ? "bg-red-600 hover:bg-red-400"
                : "bg-gray-800/50 hover:bg-gray-700"
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-2 text-white rounded-full ${
              isVideoOn
                ? "bg-gray-800/50 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-400"
            }`}
          >
            {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
          </button>

          {/* View Toggle Button */}
          <button
            onClick={toggleView}
            className="p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-700"
          >
            {fullView ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
          </button>

          {/* Main Call Control */}
          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span>Start Call</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
