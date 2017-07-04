import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

// this skips some keys to keep each row as 10 keys, for better mathing
const keySequence = `zxcvbnm,./asdfghjkl;qwertyuiop1234567890`;

// note - number of half steps up from A440
function getFrequency(note, stepsPerOctave) {
  return 440 * Math.pow(2, note * (1 / stepsPerOctave));
}

function getNoteFromKey(key) {
  const offset = keySequence.indexOf(key);
  if (offset !== -1) {
    return offset - 20; // TODO: configurable note offset
  }
  return null;
}

// TODO: support division of more than 1 octave
// TODO: add keyboard map UI and show key presses
// TODO: separate audio stuff into another file, separate from component
// TODO: test on mobile, touch logic https://raw.githubusercontent.com/stuartmemo/qwerty-hancock/master/dist/qwerty-hancock.js
class App extends Component {
  constructor(props) {
    super(props);

    // TODO: have current active keys represented in state
    this.state = {
      stepsPerOctave: 12,
    };

    this.audioContext = new window.AudioContext();
    this.notes = {};
    this.gainNode = this.audioContext.createGain();
    this.gainNode.value = 0.01;
    this.gainNode.connect(this.audioContext.destination);

    this.onChangeStepsPerOctave = this.onChangeStepsPerOctave.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopAllNotes = this.stopAllNotes.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  componentDidMount() {
    // TODO: unbind this on unmount

    window.addEventListener('keydown', (event) => {
      const note = getNoteFromKey(event.key);
      if (note) {
        this.startNote(note);
      }
    });

    window.addEventListener('keyup', (event) => {
      const note = getNoteFromKey(event.key);
      if (note) {
        this.stopNote(note);
      }
    });
  }

  startNote(note) {
    if (this.notes[note]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note, this.state.stepsPerOctave);
    oscillator.connect(this.gainNode);
    oscillator.start(0);

    console.log('playing frequency: ', oscillator.frequency.value);

    this.notes[note] = oscillator;
  }

  stopAllNotes() {
    Object.keys(this.notes).map((note) => {
      this.stopNote(note);
    });
  }

  stopNote(note) {
    if (!this.notes[note]) {
      return;
    }

    this.notes[note].stop(0);
    this.notes[note].disconnect();
    delete this.notes[note];
  }

  onClick(note) {
    if (this.notes[note]) {
      this.stopNote(note);
    } else {
      this.startNote(note);
    }
  }

  onChangeStepsPerOctave(event) {
    console.log('onChangeStepsPerOctave', event.target.value);

    this.stopAllNotes();
    this.setState({
      stepsPerOctave: parseInt(event.target.value),
    });
  }

  render() {
    return (
      <div>
        <select value={this.state.stepsPerOctave} onChange={this.onChangeStepsPerOctave}>
          {
            _.range(50).map((index) => <option value={index} key={index}>{index}</option>)
          }
        </select>

        {
          _.range(this.state.stepsPerOctave + 1).map((index) => {
            return (
              <button onClick={this.onClick.bind(this, index)} key={index}>{index}</button>
            );
          })
        }

        <button onClick={this.stopAllNotes}>Stop</button>
      </div>
    );
  }
}

export default App;
