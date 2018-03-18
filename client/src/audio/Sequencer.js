/*
//TODO cleanup docs
window.seq = new Sequencer(new window.AudioContext(), [
  [
    [440, 0, 1],
    [400, 1, 1],
    [550, 2, 1],
    [480, 3, 1],
  ],
  [
    [480, 0, 1],
    [410, 1, 1],
    [590, 2, 0.5],
    [420, 5, 2],
  ],
]);
*/

// TODO: refactor into objects instead of arrays
class Sequencer {
  constructor({
    audioContext,
    sequences,
    gain
  } = {}) {
    this.context = audioContext;
    this.gain = gain;
    this.sequences = sequences;
    this.oscillators = [];
  }

  play() {
    this.sequences.forEach((sequence) => {
      this.playSequence(sequence);
    });
  }

  stop = () => {
    this.oscillators.forEach((oscillator) => {
      oscillator.stop();
    });
  };

  playSequence(sequence) {
    const now = this.context.currentTime;

    const gainNode = this.context.createGain();
    gainNode.gain.value = this.gain;
    gainNode.connect(this.context.destination);

    const oscillator = this.context.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    oscillator.start(now);

    gainNode.gain.setValueAtTime(0, now);

    sequence.forEach(([freq, offset, duration]) => {
      gainNode.gain.setValueAtTime(this.gain, now + offset);
      gainNode.gain.setValueAtTime(0, now + offset + duration);
      oscillator.frequency.setValueAtTime(freq, now + offset);
    });

    const endOffset = Math.max(
      ...sequence.map(([freq, offset, duration]) => {
        return offset + duration;
      })
    );
    oscillator.stop(now + endOffset);

    this.oscillators.push(oscillator);
  }
}

export default Sequencer;
