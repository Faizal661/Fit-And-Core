import { Socket } from "socket.io";

export interface IVideoCallService {
  registerSocketEvents(socket: Socket): void;
  handleJoinSession(
    socket: Socket,
    data: { bookingId: string; userId: string; userType: string }
  ): void;
  handleDisconnect(socketId: string): void;
  handleUserStatus(
    socket: Socket,
    data: {
      bookingId: string;
      isMuted: boolean;
      isVideoOn: boolean;
      isConnected: boolean;
    }
  ): void;
  handleUserLeft(socket: Socket, bookingId: string): void;
}
