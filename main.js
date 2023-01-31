const socket = io();
    // Connect to the server
socket.connect();

const startRecord = document.getElementById('startRecord');
// Get audio stream from microphone
startRecord.addEventListener('startRecord', function (e) {
    e.preventDefault();
    // navigator.mediaDevices.getUserMedia({ audio: true })
    //     .then(stream => {
    //         // Create an audio context
    //         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //         const source = audioContext.createMediaStreamSource(stream);
    //         const processor = audioContext.createScriptProcessor(1024, 1, 1);

    //         // Connect the audio source to the script processor
    //         source.connect(processor);
    //         processor.connect(audioContext.destination);

    //         // Process audio data
    //         processor.onaudioprocess = event => {
    //             const data = event.inputBuffer.getChannelData(0);
    //             socket.emit("stream-audio", data);
    //         };
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    startRecord.remove();
});

const startPlay = document.getElementById('startPlay');
// // Play audio stream from server
startPlay.addEventListener('startPlay', function (e) {
    e.preventDefault();
    socket.on("audio-stream", data => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, data.length, audioContext.sampleRate);
        buffer.getChannelData(0).set(data);
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    });
    startPlay.remove();
});


var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});