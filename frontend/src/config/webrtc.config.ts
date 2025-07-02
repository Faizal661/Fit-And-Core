export const WebRTCConfig = {
  iceServers: [
    { urls: import.meta.env.VITE_STUN_SERVER_URL },
    // {
    // TURN server
    //   urls: 'turn:turn-server.com',
    //   username: '',
    //   credential: 'password'
    // }
  ],
  iceCandidatePoolSize: 10,
  mediaConstraints: {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  },
};
