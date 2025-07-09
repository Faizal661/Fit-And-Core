import { RingAlert } from "./RingAlert";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { io, Socket } from "socket.io-client";
import { VideoCallModal } from "../modal/VideoCallModal";

export const CallingAlert = () => {
  const socket = useRef<Socket | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const [isRinging, setIsRinging] = useState(false);
  const [callerInfo, setCallerInfo] = useState<{
    id: string;
    type: "trainer" | "trainee";
    name: string;
    profilePicture: string;
  } | null>(null);
  // const [hasCallEnded, setHasCallEnded] = useState(false);
  const [bookingId, SetBookingId] = useState("");

  useEffect(() => {
    if (!user) return;

    socket.current = io(`${import.meta.env.VITE_API_URL}`);

    socket.current.on("connect", () => {
      console.log("Socket.IO connected for receiving calls");
      socket.current?.emit("registerUserSocket", user.id);
    });

    socket.current.on(
      "incoming-call",
      (data: {
        bookingId: string;
        callerId: string;
        callerType: "trainer" | "trainee";
        callerName: string;
        callerProfilePicture: string;
      }) => {
        if (data.bookingId) {
          setIsRinging(true);
          SetBookingId(data.bookingId);
          setCallerInfo({
            id: data.callerId,
            type: data.callerType,
            name: data.callerName,
            profilePicture: data.callerProfilePicture,
          });
        }
      }
    );

    socket.current.on("disconnect", () => {
      console.log("Socket.IO disconnected for incoming calls");
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [user,isRinging]);

  const acceptCall = async () => {
    if (!socket.current) return;
    socket.current.emit("accept-call", { bookingId });
    setIsRinging(false);
  };

  const rejectCall = async () => {
    if (!socket.current) return;
    socket.current.emit("reject-call", { bookingId });
    setIsRinging(false);
    setCallerInfo(null);
    // setHasCallEnded(true);
  };

  return (
    <div>
      {isRinging && callerInfo && (
        <RingAlert
          callerInfo={callerInfo!}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
      { callerInfo && (
        <VideoCallModal
          bookingId={bookingId}
          userId={user?.id ?? ""}
          userType={callerInfo?.type === "trainer" ? "trainee" : "trainer"}
          remoteProfilePicture={callerInfo?.profilePicture}
          localProfilePicture={user?.profilePicture}
          onClose={() => {
            setCallerInfo(null);
          }}
        />
      )}
    </div>
  );
};
