const socket = io();
    // Connect to the server
socket.connect();

const startRecord = document.getElementById('startRecord');
const stopRecord = document.getElementById('stopRecord');
// Get audio stream from microphone
startRecord.addEventListener('click', function (e) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create an audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(1024, 1, 1);

            // Connect the audio source to the script processor
            source.connect(processor);
            processor.connect(audioContext.destination);

            // Process audio data
            processor.onaudioprocess = event => {
                const data = event.inputBuffer.getChannelData(0);
                socket.emit("stream-audio", data);
            };
        })
        .catch(error => {
            console.error(error);
        });
    startRecord.hidden = true;
    stopRecord.hidden = false;
});
stopRecord.addEventListener('click', function (e) {
    startRecord.hidden = false;
    stopRecord.hidden = true;
});

const startPlay = document.getElementById('startPlay');
const stopPlay = document.getElementById('stopPlay');
// // Play audio stream from server
startPlay.addEventListener('click', function (e) {
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
    startPlay.hidden = true;
    stopPlay.hidden = false;
});
stopRecord.addEventListener('click', function (e) {
    startPlay.hidden = false;
    stopPlay.hidden = true;
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