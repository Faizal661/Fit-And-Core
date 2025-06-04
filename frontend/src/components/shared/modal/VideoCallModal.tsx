import { useEffect, useRef, useState } from "react";
import { useVideoCall } from "../../../hooks/useVideoCall";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Maximize2,
  Minimize2,
  User,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";

interface VideoCallModalProps {
  bookingId: string;
  userId: string;
  userType: "trainer" | "trainee";
  remoteProfilePicture?: string;
  localProfilePicture?: string;
  onClose: () => void;
}

export const VideoCallModal = ({
  bookingId,
  userId,
  userType,
  remoteProfilePicture,
  localProfilePicture,
  onClose,
}: VideoCallModalProps) => {
  const {
    localStream,
    remoteStream,
    remoteStatus,
    isMuted,
    isVideoOn,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useVideoCall(bookingId, userId, userType);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [fullView, setFullView] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOn]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      if (remoteStream && remoteStatus.isVideoOn) {
        remoteVideoRef.current.srcObject = remoteStream;
      } else {
        remoteVideoRef.current.srcObject = null;
      }
    }
  }, [remoteStream, remoteStatus.isVideoOn]);

  useEffect(() => {
    if (remoteStatus.hasLeft) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [remoteStatus.hasLeft, onClose]);

  useEffect(() => {
    startCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleMute = async () => {
    await toggleMute(!isMuted);
  };

  const handleToggleVideo = async () => {
    await toggleVideo(!isVideoOn);
  };

  const toggleView = () => {
    setFullView(!fullView);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-75 flex items-center justify-center z-50 h-screen">
      <div className="w-full max-w-7xl h-[80vh] flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-300">
            Video Call Session
          </h2>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-slate-300 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 relative">
          <div
            className={`
              absolute bg-black right-0 h-full rounded-lg transition-all ease-in duration-300
              ${!fullView ? "w-[50%]" : "w-full"}
            `}
          >
            {remoteStatus.hasLeft ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-lg">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  {remoteProfilePicture ? (
                    <img
                      src={remoteProfilePicture}
                      alt="Remote User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User size={48} className="text-slate-400" />
                  )}
                </div>
                <p className="text-slate-300 text-xl">
                  {userType === "trainer" ? "Trainee" : "Trainer"} has left the
                  call
                </p>
              </div>
            ) : remoteStream ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover rounded-lg ${
                    !remoteStatus.isVideoOn ? "bg-slate-800" : "bg-slate-700"
                  }`}
                />
                {!remoteStatus.isVideoOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      {remoteProfilePicture ? (
                        <img
                          src={remoteProfilePicture}
                          alt="Remote User"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={48} className="text-slate-400" />
                      )}
                    </div>
                    <p className="text-slate-300">
                      {userType === "trainer" ? "Trainee" : "Trainer"}'s camera
                      is off
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-lg">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  {remoteProfilePicture ? (
                    <img
                      src={remoteProfilePicture}
                      alt="Remote User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User size={48} className="text-slate-400" />
                  )}
                  <div className="absolute w-24 h-24 border-white border-y-3 border-l-3 rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-slate-300 text-xl flex items-center justify-between">
                    Connecting to{" "}
                    {userType === "trainer" ? "trainee" : "trainer"} ...
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-2 left-2 flex gap-2">
              <div className="bg-black/50 text-white p-2 rounded text-sm">
                {userType === "trainer" ? "Trainee" : "Trainer"}
              </div>
              {remoteStatus.isMuted && (
                <div className="bg-black/50 text-white p-2 rounded-full">
                  <MicOff size={16} />
                </div>
              )}
              {!remoteStatus.isVideoOn && (
                <div className="bg-black/50 text-white p-2 rounded-full">
                  <VideoOff size={16} />
                </div>
              )}
            </div>

            <button
              onClick={toggleView}
              className="absolute bottom-4 right-4 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-700"
            >
              {fullView ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Local Stream - position changes based on fullView state */}
          <div
            className={`
              absolute bg-gray-500 rounded-lg overflow-hidden transition-all duration-300
              ${fullView ? "top-2 left-2 w-[26vh] h-[26vh]" : "w-[49%] h-full"}
              ${!isVideoOn ? "bg-slate-800" : ""}
            `}
          >
            {isVideoOn && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover bg-slate-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-2">
                  {localProfilePicture ? (
                    <img
                      src={localProfilePicture}
                      alt="Local User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User size={32} className="text-slate-400" />
                  )}
                </div>
                <p className="text-slate-300 text-sm">Your camera is off</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex gap-2">
              <div className="bg-black/50 text-white p-1 rounded text-sm">
                You
              </div>
              {isMuted && (
                <div className="bg-black/50 text-white p-1 rounded-full">
                  <MicOff size={12} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 pt-6 flex justify-center gap-4">
          {/* Media Control Buttons */}
          <button
            onClick={handleToggleMute}
            className={`p-3 text-white rounded-full ${
              isMuted
                ? "bg-red-600 hover:bg-red-500"
                : "bg-gray-800/50 hover:bg-gray-700"
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={handleToggleVideo}
            className={`p-3 text-white rounded-full ${
              isVideoOn
                ? "bg-gray-800/50 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
          </button>

          {/* View Toggle Button */}
          <button
            onClick={toggleView}
            className="p-3 bg-gray-800/50 text-white rounded-full hover:bg-gray-700"
          >
            {fullView ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
          </button>

          {/* Main Call Control */}
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center gap-2"
          >
            <span>End Call</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        type="warning"
        title="End Video Call"
        message={"Are you sure you want to end this video call?"}
        confirmText="End"
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleEndCall}
      />
    </div>
  );
};
