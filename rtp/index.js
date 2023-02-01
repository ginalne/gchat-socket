const socket = io();
socket.connect();
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const log = document.getElementById("log");
const connection = document.getElementById("connection");
const sendOffer = document.getElementById("sendOffer");

// Create a peer connection
const peerConnection = new RTCPeerConnection();
let mediaStream = undefined;
setInterval(() => {
  connection.innerHTML = JSON.stringify(peerConnection.localDescription);
}, 1000);
// Add local stream to the peer connection
navigator.mediaDevices.getUserMedia({ video: true, audio:true })
  .then(stream => {
    localVideo.srcObject = mediaStream = stream;
  });

// Handle incoming remote stream
peerConnection.ontrack = ({ streams: [stream] }) => {
  console.log('peerConnection.ontrack');
  remoteVideo.srcObject = stream;
};
var myOffer = undefined;
// Create an offer to initiate the connection
sendOffer.addEventListener('click', function (e) {
  peerConnection.createOffer()
    .then(offer => {
      console.log(offer);
      myOffer = offer;
      peerConnection.setLocalDescription(offer);
      log.innerHTML += "<BR><STRONG>SEND REMOTE :</STRONG>";
      socket.emit('offer', offer);
  });
});

socket.on("remote", data => {
  console.log(data);
  if (myOffer && myOffer.type == 'offer') {
    log.innerHTML = "<STRONG>GET REMOTE :</STRONG> I've received mine?";
    if (myOffer.sdp === data.sdp) {
      log.innerHTML += " Yes";
      return;
    } else {
      log.innerHTML += " No";
    }
  }
  log.innerHTML = '<STRONG>GET REMOTE</STRONG> : ' + JSON.stringify(data ?? '');

  peerConnection.setRemoteDescription(new RTCSessionDescription(data))
    .then(() => {
      // Create an answer and set it as local description
      return peerConnection.createAnswer();
    })
    // .then(answer => {
    //   // Set local description
    //   return peerConnection.setLocalDescription(answer);
    // })
    .then((answer) => {
      // Send the answer back to the server
      myOffer = answer;
      peerConnection.setLocalDescription(answer);
      peerConnection.addStream(mediaStream);
      log.innerHTML += '<br><strong>TRY SEND ANSWER :</strong><br>' + JSON.stringify(myOffer ?? '');
      socket.emit("answer", answer);
    })
    .catch(error => {
      console.error(error);
    });
});

socket.on("answer", data => {
  console.log(data);
  if (myOffer && myOffer.type == 'answer') {
    log.innerHTML += "<BR><STRONG>GET ANSWER :</STRONG>something answering <?> it can be me";
  }else{
    myOffer = data;
    try {
      peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      log.innerHTML += '<BR><STRONG>GET ANSWER :</STRONG> ' + JSON.stringify(data) + '<br>RTCSession Start!';
    } catch (err) {
      log.innerHTML += 'ERROR ANSWER : ' + err.message;
    }
  }
});
// Handle incoming answer from the remote peer
peerConnection.ondescription = (answer) => {
  peerConnection.setRemoteDescription(answer);
};