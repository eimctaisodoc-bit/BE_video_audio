const socket = io("http://localhost:5000/");





// const roomInput = document.getElementById("roomId");
// const statusBox = document.getElementById("status");
// const remoteAudio = document.getElementById("remoteAudio");
// const muteBtn = document.getElementById("muteBtn");

// let localStream = null;
// let peerConnection = null;
// let isMuted = false;
// let joinedRoom = null;

// const rtcConfig = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" }
//   ]
// };

// function setStatus(message) {
//   statusBox.textContent = `Status: ${message}`;
// }

// async function createPeerConnection() {
//   peerConnection = new RTCPeerConnection(rtcConfig);

//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate && joinedRoom) {
//       socket.emit("ice-candidate", {
//         roomId: joinedRoom,
//         candidate: event.candidate
//       });
//     }
//   };

//   peerConnection.ontrack = (event) => {
//     remoteAudio.srcObject = event.streams[0];
//     setStatus("Connected - live voice active");
//   };

//   if (localStream) {
//     localStream.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream);
//     });
//   }
// }

// async function startCall() {
//   try {
//     joinedRoom = roomInput.value.trim();

//     if (!joinedRoom) {
//       setStatus("Please enter room id");
//       return;
//     }

//     setStatus("Requesting microphone...");

//     localStream = await navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         autoGainControl: true
//       },
//       video: false
//     });

//     socket.emit("join-room", joinedRoom);
//     console.log('Room is join',joinedRoom)
//     setStatus("Joined room, waiting for other user...");
//   } catch (error) {
//     console.error(error);
//     setStatus("Microphone access failed");
//   }
// }

// socket.on("user-joined", async () => {
//   try {
//     setStatus("User joined, creating call...");

//     if (!peerConnection) {
//       await createPeerConnection();
//     }

//     const offer = await peerConnection.createOffer({
//       offerToReceiveAudio: true
//     });

//     await peerConnection.setLocalDescription(offer);

//     socket.emit("offer", {
//       roomId: joinedRoom,
//       offer
//     });

//     setStatus("Calling...");
//   } catch (error) {
//     console.error(error);
//     setStatus("Failed to create offer");
//   }
// });

// socket.on("offer", async ({ offer }) => {
//   try {
//     setStatus("Incoming call... connecting");

//     if (!localStream) {
//       localStream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         },
//         video: false
//       });
//     }

//     if (!peerConnection) {
//       await createPeerConnection();
//     }

//     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);

//     socket.emit("answer", {
//       roomId: joinedRoom,
//       answer
//     });

//     setStatus("Answer sent...");
//   } catch (error) {
//     console.error(error);
//     setStatus("Failed to answer call");
//   }
// });

// socket.on("answer", async ({ answer }) => {
//   try {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//     setStatus("Connected");
//   } catch (error) {
//     console.error(error);
//     setStatus("Failed to set answer");
//   }
// });

// socket.on("ice-candidate", async ({ candidate }) => {
//     console.log('candidate',candidate)
//   try {
//     if (peerConnection && candidate) {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//   } catch (error) {
//     console.error("ICE candidate error:", error);
//   }
// });

// socket.on("call-ended", () => {
//   cleanupCall(false);
//   setStatus("Call ended by other user");
// });

// function toggleMute() {
//   if (!localStream) return;

//   isMuted = !isMuted;

//   localStream.getAudioTracks().forEach((track) => {
//     track.enabled = !isMuted;
//   });

//   muteBtn.textContent = isMuted ? "Unmute Mic" : "Mute Mic";
//   setStatus(isMuted ? "Mic muted" : "Mic active");
// }

// function endCall() {
//   if (joinedRoom) {
//     socket.emit("end-call", { roomId: joinedRoom });
//   }

//   cleanupCall(true);
//   setStatus("Call ended");
// }

// function cleanupCall(resetRoom = false) {
//   if (peerConnection) {
//     peerConnection.ontrack = null;
//     peerConnection.onicecandidate = null;
//     peerConnection.close();
//     peerConnection = null;
//   }

//   if (localStream) {
//     localStream.getTracks().forEach((track) => track.stop());
//     localStream = null;
//   }

//   remoteAudio.srcObject = null;
//   isMuted = false;
//   muteBtn.textContent = "Mute Mic";

//   if (resetRoom) {
//     joinedRoom = null;
//   }
// }