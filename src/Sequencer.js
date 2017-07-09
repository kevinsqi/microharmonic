const GAIN = 0.02;

// TODO: refactor into objects
class Sequencer {
  constructor(audioContext, sequences) {
    this.context = audioContext;
    this.sequences = sequences;
  }

  play() {
    this.sequences.forEach((sequence) => {
      this.playSequence(sequence);
    });
  }

  playSequence(sequence) {
    const now = this.context.currentTime;

    const gainNode = this.context.createGain();
    gainNode.gain.value = GAIN;
    gainNode.connect(this.context.destination);

    const oscillator = this.context.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    oscillator.start(now);

    gainNode.gain.setValueAtTime(0, now);

    sequence.forEach(([freq, offset, duration]) => {
      gainNode.gain.setValueAtTime(GAIN, now + offset);
      gainNode.gain.setValueAtTime(0, now + offset + duration);
      oscillator.frequency.setValueAtTime(freq, now + offset);
    });

    const endOffset = Math.max(
      ...sequence.map(([freq, offset, duration]) => {
        return offset + duration;
      })
    );
    oscillator.stop(now + endOffset);

    // noreintegrate correct?
    oscillator.onended = () => {
      gainNode.disconnect();
      oscillator.disconnect();
    }
  }
}

export default Sequencer;
