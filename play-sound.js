
startPlay.addEventListener('click', function (e) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // const buffer = audioCtx.createBuffer(1, dataBuffer[0].length, audioCtx.sampleRate);
    // freqPerSec = dataBuffer[0].length / audioCtx.sampleRate + 0.5;
    // if (dataIndex < dataBuffer.length) {
        const source = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, dataBuffer[0].length * dataBuffer.length, audioCtx.sampleRate);
        const channel = buffer.getChannelData(0);
        let index = 0;
        dataBuffer.forEach(buff => {
            console.log("Playing Record...", index);
            buff.forEach(
                value => {
                    channel[index] = value;
                    index++;
                }
            )
        });
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
        // dataIndex++;
    // } else
    //     clearInterval(interId);
});