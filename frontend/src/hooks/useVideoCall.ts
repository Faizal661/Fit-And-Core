import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { WebRTCConfig } from "../config/webrtc.config";

export const useVideoCall = (
  bookingId: string | undefined,
  userId: string | undefined,
  userType: "trainer" | "trainee"
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    socket.current = io("http://localhost:5000"); //`${import.meta.env.VITE_API_URL}`

    // Initialize peer connection
    peerConnection.current = new RTCPeerConnection({
      iceServers: WebRTCConfig.iceServers,
    });

    // Set up remote stream handler
    peerConnection.current.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      setRemoteStream(remoteStream);
    };

    // ICE candidate handler
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit("ice-candidate", {
          candidate: event.candidate,
          bookingId,
        });
      }
    };

    // Socket event handlers
    socket.current.on("connect", () => {
      socket.current?.emit("joinSession", { bookingId, userId, userType });
    });

    socket.current.on("readyForCall", async () => {
      if (userType === "trainer") {
        await startCall();
      }
    });

    socket.current.on(
      "offer",
      async (data: { offer: RTCSessionDescriptionInit }) => {
        if (userType === "trainee") {
          await handleOffer(data.offer);
        }
      }
    );

    socket.current.on(
      "answer",
      async (data: { answer: RTCSessionDescriptionInit }) => {
        if (userType === "trainer") {
          await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      }
    );

    socket.current.on(
      "ice-candidate",
      async (data: { candidate: RTCIceCandidate }) => {
        try {
          await peerConnection.current?.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    );

    socket.current.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.current?.disconnect();
      endCall();
    };
  }, [bookingId, userId, userType]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        WebRTCConfig.mediaConstraints
      );
      setLocalStream(stream);
      setIsCallActive(true);

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (userType === "trainer") {
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        socket.current?.emit("offer", { offer, bookingId });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      endCall();
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.current?.emit("answer", { answer, bookingId });
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCallActive(false);
    socket.current?.emit("endCall", { bookingId });
  };

  return {
    localStream,
    remoteStream,
    isCallActive,
    startCall,
    endCall,
  };
};
