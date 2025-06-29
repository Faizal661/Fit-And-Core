import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  User,
  Calendar,
  Clock,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Video,
} from "lucide-react";
import { fetchBookingDetails } from "../../services/session/BookingService";

interface BookingDetailsModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailsModal = ({
  bookingId,
  isOpen,
  onClose,
}: BookingDetailsModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const trainerVideoRef = useRef<HTMLVideoElement>(null);
  const traineeVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingDetails(bookingId),
    enabled: isOpen && !!bookingId,
  });

  const syncVideos = (action: "play" | "pause" | "seek", time?: number) => {
    const trainerVideo = trainerVideoRef.current;
    const traineeVideo = traineeVideoRef.current;

    if (action === "play") {
      trainerVideo?.play();
      traineeVideo?.play();
      setIsPlaying(true);
    } else if (action === "pause") {
      trainerVideo?.pause();
      traineeVideo?.pause();
      setIsPlaying(false);
    } else if (action === "seek" && time !== undefined) {
      if (trainerVideo) trainerVideo.currentTime = time;
      if (traineeVideo) traineeVideo.currentTime = time;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      syncVideos("pause");
    } else {
      syncVideos("play");
    }
  };

  const handleMute = () => {
    const trainerVideo = trainerVideoRef.current;
    const traineeVideo = traineeVideoRef.current;

    const newMutedState = !isMuted;
    if (trainerVideo) trainerVideo.muted = newMutedState;
    if (traineeVideo) traineeVideo.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    syncVideos("seek", time);
  };

  const handleRestart = () => {
    syncVideos("seek", 0);
    setCurrentTime(0);
    if (isPlaying) {
      syncVideos("play");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const trainerVideo = trainerVideoRef.current;
      if (trainerVideo && !trainerVideo.paused) {
        setCurrentTime(trainerVideo.currentTime);
        if (trainerVideo.duration) {
          setDuration(trainerVideo.duration);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const trainerVideo = trainerVideoRef.current;

    const handleLoadedData = () => {
      if (trainerVideo?.duration) {
        setDuration(trainerVideo.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    trainerVideo?.addEventListener("loadeddata", handleLoadedData);
    trainerVideo?.addEventListener("ended", handleEnded);

    return () => {
      trainerVideo?.removeEventListener("loadeddata", handleLoadedData);
      trainerVideo?.removeEventListener("ended", handleEnded);
    };
  }, [booking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={containerRef}
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Failed to load booking details. Please try again.
            </div>
          )}

          {booking && (
            <div className="space-y-8">
              {/* Participants Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trainer */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Trainer
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {booking.trainer.profilePicture ? (
                        <img
                          src={booking.trainer.profilePicture}
                          alt={booking.trainer.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {booking.trainer.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trainee */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} className="text-green-600" />
                    Trainee
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {booking.trainee.profilePicture ? (
                        <img
                          src={booking.trainee.profilePicture}
                          alt={booking.trainee.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {booking.trainee.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Session Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {new Date(booking.slotStart).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">
                        {booking.slotDetails.startTime} - {booking.slotDetails.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-amber-600" />
                    Session Notes
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {booking.notes}
                  </p>
                </div>
              )}

              {/* Video Section */}
              {(booking.trainerVideoUrl || booking.traineeVideoUrl) && (
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Video size={20} className="text-blue-400" />
                    Session Video
                  </h3>

                  {/* Video Players */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {booking.trainerVideoUrl && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          {booking.trainer.username} (Trainer)
                        </p>
                        <video
                          ref={trainerVideoRef}
                          src={booking.trainerVideoUrl}
                          className="w-full h-60 bg-black rounded-lg object-cover"
                          controls={false}
                        />
                      </div>
                    )}
                    {booking.traineeVideoUrl && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">{booking.trainee.username} (Trainee)</p>
                        <video
                          ref={traineeVideoRef}
                          src={booking.traineeVideoUrl}
                          className="w-full h-60 bg-black rounded-lg object-cover"
                          controls={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className=" rounded-lg ">
                    {/* Progress Bar */}
                    <div>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        {/* <span>{formatTime(duration)}</span> */}
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={handleRestart}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
                      >
                        <RotateCcw size={20} />
                      </button>

                      <button
                        onClick={handlePlayPause}
                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>

                      <button
                        onClick={handleMute}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
                      >
                        {isMuted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Upload Timestamps */}
                  <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                    {booking.trainerVideoUploadedAt && (
                      <p>
                        Video saved time:{" "}
                        {new Date(
                          booking.trainerVideoUploadedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
