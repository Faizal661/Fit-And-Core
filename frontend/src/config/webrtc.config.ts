export const WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Add your TURN servers here for production
    // {
    //   urls: 'turn:your-turn-server.com',
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