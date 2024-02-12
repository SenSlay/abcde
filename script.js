let modal = document.querySelector(".my-modal");

modal.addEventListener('click', function() {
    modal.style.display = "none";
});

const startBtn = document.getElementById('startButton');

function happyBirthday() {
    const audio = document.getElementById('bday-audio');
    
    // Play the audio
    audio.play();
    audio.volume = 0.35;
    
    // Check if the browser supports the Web Audio API and getUserMedia
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    
    if (navigator.getUserMedia) {
        // Request access to the microphone
        navigator.getUserMedia({ audio: true }, function(stream) {
            // Microphone access successful
    
            // Create a MediaStreamAudioSourceNode from the microphone stream
            const source = audioContext.createMediaStreamSource(stream);
    
            // Create an AnalyserNode for analyzing the audio data
            const analyser = audioContext.createAnalyser();
    
            // Connect the microphone source to the analyser node
            source.connect(analyser);
    
            // Set the FFT size (number of bins) for frequency analysis
            analyser.fftSize = 2048;
    
            // Get the number of frequency bins
            const bufferLength = analyser.frequencyBinCount;
    
            // Create a Uint8Array to store frequency data
            const dataArray = new Uint8Array(bufferLength);

            const loudnessThreshold = 40;
    
            // Define a function to analyze the frequency data and display in console
            function analyze() {
                // Get frequency data into the dataArray
                analyser.getByteFrequencyData(dataArray);
                
                // Log the frequency data to console
                console.log(dataArray);

                // Sum each frequency data and get the average 
                let total_frequency = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    total_frequency += dataArray[i];
                }

                let ave_frequency = total_frequency/dataArray.length;

                // Display the average frequency per dataArray
                console.log(ave_frequency);

                const flameEl = document.querySelector(".flame");

                if (ave_frequency > loudnessThreshold) {
                    flameEl.classList.remove("flame-animation");
                    flameEl.classList.add("blown-out");
                }
        
                total_frequency = 0;
                setTimeout(analyze, 1000);
            }

            analyze()
            
        }, function(err) {
            // Microphone access failed
            console.error('Microphone access denied', err);
        });
    } else {
        console.error('getUserMedia not supported in this browser');
    }
    startBtn.removeEventListener('click', happyBirthday);
}

startBtn.addEventListener('click', happyBirthday);