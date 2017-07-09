function flattenArrays(arrays) {
  return [].concat.apply([], arrays);
}

class Sequencer {

  constructor(audioContext, sequence) {
    this.context = audioContext;

    this.sequence = sequence;

  }

  play() {
    const now = this.context.currentTime;

    // this implement rests using 0 gain, could be better way
    const frequencySequence = flattenArrays(
      this.sequence.map(([freq, start, duration]) => {
        return [
          [freq, start],
          [0, start + duration],
        ];
      })
    );

    console.log(frequencySequence);

    const oscillator = this.context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 0;
    oscillator.connect(this.context.destination);
    oscillator.start(now);

    frequencySequence.forEach(([freq, start]) => {
      console.log(freq, start);

      oscillator.frequency.setValueAtTime(freq, start);
    });

    oscillator.stop(frequencySequence[frequencySequence.length - 1][1]);
    oscillator.disconnect();
  }

}

export default Sequencer;
