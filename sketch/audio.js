const toggleSoundButton = document.getElementById("EnableSound");

(function(soundContainerElement, soundActivationElement) {

    // Create audio context.
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'balanced',
        sampleRate: 44100
    });
    const gainNode = audioContext.createGain();

    gainNode.connect(audioContext.destination);

    // Build playable notes.
    let oscillatorList = [];

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth#making_music
    const playSound = function(frequency = 440, waveform = 'triangle') {
        const osc = audioContext.createOscillator();
        osc.frequency.value = frequency;
        osc.type = waveform;
        osc.connect(gainNode);
        osc.start();

        return osc;
    };

    // https://pages.mtu.edu/~suits/notefreqs.html
    const Notes = new Array(
        { name: "C3",  frequency: 130.81 },
        { name: "C3♯", frequency: 138.59 },
        { name: "D3",  frequency: 146.83 },
        { name: "E3♭", frequency: 155.66 },
        { name: "E3",  frequency: 164.81 },
        { name: "F3",  frequency: 174.61 },
        { name: "F3♯", frequency: 185.00 },
        { name: "G3",  frequency: 196.00 },
        { name: "G3♯", frequency: 207.65 },
        { name: "A3",  frequency: 220.00 },
        { name: "B3♭", frequency: 233.08 },
        { name: "B3",  frequency: 246.94 },
        { name: "C4",  frequency: 261.63 },
        { name: "C4♯", frequency: 277.18 },
        { name: "D4",  frequency: 293.66 },
        { name: "E4♭", frequency: 311.13 },
        { name: "E4",  frequency: 329.63 },
        { name: "F4",  frequency: 349.23 },
        { name: "F4♯", frequency: 369.99 },
        { name: "G4",  frequency: 392.00 },
        { name: "G4♯", frequency: 415.30 },
        { name: "A4",  frequency: 440.00 },
        { name: "B4♭", frequency: 466.16 },
        { name: "B4",  frequency: 493.88 },
        { name: "C5",  frequency: 523.25 },
        { name: "C5♯", frequency: 554.37 },
        { name: "D5",  frequency: 587.33 },
        { name: "E5♭", frequency: 622.25 },
        { name: "E5",  frequency: 659.25 },
        { name: "F5",  frequency: 698.46 },
        { name: "F5♯", frequency: 739.99 },
        { name: "G5",  frequency: 783.99 },
        { name: "G5♯", frequency: 830.61 },
        { name: "A5",  frequency: 880.00 },
        { name: "B5♭", frequency: 932.33 },
        { name: "B5",  frequency: 987.77 }
    );

    const startNotePlaying = function(event) {

        if (audioContext.state === 'suspended') {
            return;
        }

        const dataset = event.target.dataset;
        const note = Notes.find(note => note.name === event.target.id);

        gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(gainNode.gain.defaultValue, audioContext.currentTime + 0.03);
        oscillatorList[note.name] = playSound(note.frequency);
        dataset.pressed = "true";
    };

    const endNotePlaying = function(event) {

        if (audioContext.state === 'suspended') {
            return;
        }

        const dataset = event.target.dataset;
        const note = Notes.find(x => x.name === event.target.id);

        if (dataset && dataset["pressed"]) {
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.05);
            setTimeout(() => {
                if (oscillatorList[note.name]) {
                    oscillatorList[note.name].stop();
                    delete oscillatorList[note.name];
                    delete dataset["pressed"];
                }
            }, 50);
        }
    };

    Notes.forEach((note) => {
        const keyElement = window.document.getElementById(note.name);
        const playKeyEvent = new CustomEvent('PLAY_KEY', { bubbles: true, detail: { buttons: 1 } });
        const endPlayKeyEvent = new CustomEvent('STOP_KEY', { bubbles: true });

        if (typeof keyElement != 'undefined') {
            keyElement.addEventListener('mousedown', (event) => {
                if (event.buttons & 1) {
                    event.target.dispatchEvent(playKeyEvent);
                }
            });
            keyElement.addEventListener('mouseover', (event) => {
                if (event.buttons & 1) {
                    event.target.dispatchEvent(playKeyEvent);
                }
            });
            keyElement.addEventListener('mouseleave', (event) => {
                event.target.dispatchEvent(endPlayKeyEvent);
            });
            keyElement.addEventListener('mouseup', (event) => {
                event.target.dispatchEvent(endPlayKeyEvent);
            });
            // keyElement.addEventListener('mousedown', startNotePlaying);
            // keyElement.addEventListener('mouseover', startNotePlaying);
            // keyElement.addEventListener('mouseleave', endNotePlaying);
            // keyElement.addEventListener('mouseup', endNotePlaying);
        }
    });

    // Autoplay policy.
    const initToggleSoundHandler = function(containerElement) {
        containerElement.addEventListener('TOGGLE_SOUND', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.info("Sound ON. Playback resumed.");
                });
            } else if (audioContext.state === 'running') {
                audioContext.suspend().then(() => {
                    console.info("Sound OFF. Plackback suspended.");
                });
            }
        }, false);
        containerElement.addEventListener("PLAY_KEY", (event) => {
            startNotePlaying(event);
        });
        containerElement.addEventListener("STOP_KEY", (event) => {
            endNotePlaying(event);
        });
    };

    const initToggleSound = function(toggleSoundElement) {
        const toggleSoundEvent = new CustomEvent('TOGGLE_SOUND', { bubbles: true });

        toggleSoundElement.addEventListener('click', () => {
            toggleSoundElement.dispatchEvent(toggleSoundEvent);
        }, false);
    };

    // Set-up.
    initToggleSound(soundActivationElement);
    initToggleSoundHandler(soundContainerElement);
})(window.document, toggleSoundButton);