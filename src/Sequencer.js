function flattenArrays(arrays) {
  return [].concat.apply([], arrays);
}

class Sequencer {

  constructor(audioContext, sequence) {
    this.context = audioContext;
    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = 0.02;
    this.gainNode.connect(audioContext.destination);
    this.sequence = sequence;
  }

  play() {
    const now = this.context.currentTime;

    // this implement rests using 0 gain, could be better way
    const frequencySequence = flattenArrays(
      this.sequence.map(([freq, start, duration]) => {
        return [
          [freq, start],
          //[0, start + duration],
        ];
      })
    );

    // const endTime = frequencySequence[frequencySequence.length - 1][1];

    console.log(frequencySequence);

    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 0;
    this.oscillator.connect(this.gainNode);
    this.oscillator.start(now);

    frequencySequence.forEach(([freq, start]) => {
      console.log(freq, start);

      this.oscillator.frequency.setValueAtTime(freq, start);
    });
  }

  stop() {
    this.oscillator.stop(0);
    this.oscillator.disconnect();
  }

}

export default Sequencer;
