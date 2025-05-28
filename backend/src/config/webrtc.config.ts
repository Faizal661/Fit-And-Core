export const WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    //  TURN servers for production 
    // {
    //   urls: 'turn:turn-server.com',
    //   username: 'username',
    //   credential: 'password'
    // }
  ],
  iceCandidatePoolSize: 10,
  mediaConstraints: {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  }
};