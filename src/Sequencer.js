const GAIN = 0.02;

class Sequencer {
  constructor(audioContext, sequence) {
    this.context = audioContext;
    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = GAIN;
    this.gainNode.connect(audioContext.destination);
    this.sequence = sequence;
  }

  play() {
    const now = this.context.currentTime;

    const oscillator = this.context.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(this.gainNode);
    oscillator.start(now);

    this.gainNode.gain.setValueAtTime(0, now);

    this.sequence.forEach(([freq, offset, duration]) => {
      this.gainNode.gain.setValueAtTime(GAIN, now + offset);
      this.gainNode.gain.setValueAtTime(0, now + offset + duration);
      oscillator.frequency.setValueAtTime(freq, now + offset);
    });

    const endOffset = Math.max(
      ...this.sequence.map(([freq, offset, duration]) => {
        return offset + duration;
      })
    );
    oscillator.stop(now + endOffset);

    // noreintegrate correct?
    oscillator.onended = () => {
      oscillator.disconnect();
    }
  }
}

export default Sequencer;
