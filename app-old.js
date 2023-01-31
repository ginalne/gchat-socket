const socket = io();
    // Connect to the server
    
socket.connect();
var isRecording = false;
var isPlaying = false;
var dataBuffer = [];



const startRecord = document.getElementById('startRecord');
const stopRecord = document.getElementById('stopRecord');
// Get audio stream from microphone
startRecord.addEventListener('click', function (e) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create an audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.sampleRate = 4096;
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 2, 1);
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
                dataBuffer.push(nextData);
                console.log('Recording...', dataBuffer.length, nextData.byteLength + 'Byte', nextData.length);
                // console.log(sum);
                // ctx.moveTo(currentPos, 0);
                // ctx.lineTo(currentPos, 50 + 50 * a);
                // ctx.stroke();
                currentPos++;
                // socket.emit("stream-audio", data);
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
stopRecord.addEventListener('click', function (e) {
    isRecording = false;
});

const startPlay = document.getElementById('startPlay');
const stopPlay = document.getElementById('stopPlay');
// // Play audio stream from server

// let i = 0;
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const source = audioContext.createBufferSource();
// source.connect(audioContext.destination);
// source.start();
// setInterval(() => {
//     if (isPlaying) {
//         if (i < dataBuffer.length) {
//             // const data = dataBuffer[i];
//             // const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate);
//             // source.buffer = buffer;
//             // buffer.getChannelData(0).set(data);
//             console.log("Playing buffer i-", i);
//         }
//         i += 1;
//     }
// }, 1000);


startPlay.addEventListener('click', function (e) {
    e.preventDefault();
    // socket.on("audio-stream", data => {
// }
    isPlaying = true;
    // startPlay.hidden = true;
    // stopPlay.hidden = false;
});
stopPlay.addEventListener('click', function (e) {
    e.preventDefault();
    isPlaying = false;
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