const socket = io();
    // Connect to the server
    
socket.connect();
var isRecording = false;
var isPlaying = false;
var dataBuffer = [];
var totalBandwith = 0;

const audioSampleRate = 4096;

const startRecord = document.getElementById('startRecord');
const stopRecord = document.getElementById('stopRecord');
const bandwith = document.getElementById('bandwith');
const bpm = document.getElementById('bpm');
// Get audio stream from microphone
startRecord.addEventListener('click', function (e) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create an audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.sampleRate = audioSampleRate;
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(audioSampleRate, 2, 1);
            isRecording = true;
            // Connect the audio source to the script processor
            source.connect(processor);
            processor.connect(audioContext.destination);
            // Process audio data
            processor.onaudioprocess = event => {
                const dataCh1 = event.inputBuffer.getChannelData(0);
                const dataCh2 = event.inputBuffer.getChannelData(1);
                const nextData = new Float32Array(dataCh1.length);
                for (let index = 0; index < dataCh1.length; index++) {
                    const el1 = dataCh1[index];
                    const el2 = dataCh2[index];
                    nextData[index] = (el1 + el2) / 2
                }
                // dataBuffer.push(nextData);
                console.log('Recording...', nextData.byteLength + 'Byte', nextData.length);
                socket.emit("stream-audio", nextData);
                totalBandwith += nextData.byteLength;
                bandwith.innerHTML = Math.floor(totalBandwith / 1000) + " kB";
                bpm.innerHTML = Math.floor(totalBandwith / 1000 * 60 / audioContext.currentTime) + " kB/m";
                if (!isRecording) {
                    startRecord.hidden = false;
                    stopRecord.hidden = true;
                    processor.disconnect();
                }
            };
        })
        .catch(error => {
            console.error(error);
        });
    startRecord.hidden = true;
    stopRecord.hidden = false;
});

const startPlay = document.getElementById('startPlay');
const stopPlay = document.getElementById('stopPlay');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioCtx.sampleRate = audioSampleRate;
startPlay.addEventListener('click', function (e) {
    console.log('start Listening!');
    e.preventDefault();
    socket.on("audio-stream", data => {
        const final = new Float32Array(data);
        console.log(final);
        const source = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, final.length, audioCtx.sampleRate);
        const channel = buffer.getChannelData(0);
        channel.set(final);
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    });
    isPlaying = true;
    startPlay.hidden = true;
    stopPlay.hidden = false;
});

stopPlay.addEventListener('click', function (e) {
    e.preventDefault();
    isPlaying = false;
    socket.removeAllListeners("audio-stream");
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