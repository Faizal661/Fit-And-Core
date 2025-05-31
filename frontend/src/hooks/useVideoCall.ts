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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [remoteStatus, setRemoteStatus] = useState({
    isMuted: false,
    isVideoOn: true,
    isConnected: false,
    hasLeft: false,
  });
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const initializeConnection = async () => {
      socket.current = io(`${import.meta.env.VITE_API_URL}`);

      // Create new peer connection
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
        setRemoteStatus((prev) => ({ ...prev, isConnected: true }));
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

      // Connection state handlers
      peerConnection.current.onconnectionstatechange = () => {
        console.log(
          "Connection state:",
          peerConnection.current?.connectionState
        );
      };

      peerConnection.current.onsignalingstatechange = () => {
        console.log("Signaling state:", peerConnection.current?.signalingState);
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

      // Trainee handles incoming offer from trainer
      socket.current.on(
        "offer",
        async (data: { offer: RTCSessionDescriptionInit }) => {
          if (userType === "trainee") {
            await handleOffer(data.offer);
          }
        }
      );

      // Trainer handles answer from trainee
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

      socket.current.on("user-status", (data) => {
        setRemoteStatus((prev) => ({
          ...prev,
          ...data,
        }));
      });

      socket.current.on("user-left", () => {
        setRemoteStatus((prev) => ({
          ...prev,
          isConnected: false,
          hasLeft: true,
        }));
        endCall();
      });

      socket.current.on("callEnded", () => {
        endCall();
      });
    };

    initializeConnection();

    return () => {
      endCall();
      socket.current?.disconnect();
    };
  }, [bookingId, userId, userType]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        WebRTCConfig.mediaConstraints
      );
      setLocalStream(stream);
      setIsCallActive(true);

      // Store initial tracks
      audioTrackRef.current = stream.getAudioTracks()[0];
      videoTrackRef.current = stream.getVideoTracks()[0];

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (userType === "trainer") {
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        socket.current?.emit("offer", { offer, bookingId });
      }

      sendStatusUpdate({
        isMuted: false,
        isVideoOn: true,
        isConnected: true,
      });
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

  const sendStatusUpdate = (status: Partial<typeof remoteStatus>) => {
    if (!socket.current?.connected) return;
    socket.current.emit("user-status", {
      bookingId,
      ...status,
    });
  };

  const toggleMute = async (muted: boolean) => {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });

    setIsMuted(muted);
    sendStatusUpdate({ isMuted: muted });
  };

  const toggleVideo = async (videoOn: boolean) => {
    if (!localStream) return;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = videoOn;
    });

    setIsVideoOn(videoOn);
    sendStatusUpdate({ isVideoOn: videoOn });
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    const senders = peerConnection.current?.getSenders();
    senders?.forEach((sender) => {
      sender.replaceTrack(null);
    });

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setIsCallActive(false);
    socket.current?.emit("endCall", { bookingId });
    socket.current?.emit("user-left", { bookingId });
  };

  return {
    localStream,
    remoteStream,
    isCallActive,
    isMuted,
    isVideoOn,
    remoteStatus,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
};
