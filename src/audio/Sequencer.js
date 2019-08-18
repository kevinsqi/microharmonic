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

function getEndTime(sequence) {
  return Math.max(
    ...sequence.map(([freq, offset, duration]) => {
      return offset + duration;
    }),
  );
}

// TODO: refactor into objects instead of arrays
class Sequencer {
  constructor({ audioContext, sequences, totalDuration, gain } = {}) {
    this.context = audioContext;
    this.gain = gain;
    this.sequences = sequences;
    this.totalDuration = totalDuration;
    this.oscillators = [];
    this.playSequencesInterval = null;
  }

  play = () => {
    this.playSequences();
    this.playSequencesInterval = setInterval(this.playSequences, this.totalDuration * 1000);
  };

  stop = () => {
    clearInterval(this.playSequencesInterval);

    this.oscillators.forEach((oscillator) => {
      oscillator.stop();
    });
    this.oscillators = [];
  };

  playSequences = () => {
    this.sequences.forEach((sequence) => {
      const oscillator = this.playSequence(sequence);
      this.oscillators.push(oscillator);
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

    oscillator.stop(now + getEndTime(sequence));
    return oscillator;
  }
}

export default Sequencer;
