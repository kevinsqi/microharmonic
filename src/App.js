import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

// TODO: be able to configure 1-10 keys per row?
const keyRows = [
  `zxcvbnm,./`,
  `asdfghjkl;`,
  `qwertyuiop`,
  `1234567890`,
];
const keySequence = keyRows.join('');

// note - number of half steps up from A440
function getFrequency(note, numOctaves, numSteps) {
  return 440 * Math.pow(2, note * (numOctaves / numSteps));
}

function getNoteFromKey(key) {
  const offset = keySequence.indexOf(key);
  if (offset !== -1) {
    return offset - 20; // TODO: configurable note offset
  }
  return null;
}

// TODO: add filter/effect to be similar to sevish-droplet
// TODO: add keyboard map UI and show key presses
// TODO: separate audio stuff into another file, separate from component
// TODO: test on mobile, touch logic https://raw.githubusercontent.com/stuartmemo/qwerty-hancock/master/dist/qwerty-hancock.js
class App extends Component {
  constructor(props) {
    super(props);

    // TODO: have current active keys represented in state
    this.state = {
      numOctaves: 1,
      numSteps: 12,
      notes: {}, // TODO: use immutable.js
    };

    this.audioContext = new window.AudioContext();
    this.notes = {};
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.05;
    this.gainNode.connect(this.audioContext.destination);

    this.onChangeChord = this.onChangeChord.bind(this);
    this.onChangeNumOctaves = this.onChangeNumOctaves.bind(this);
    this.onChangeNumSteps = this.onChangeNumSteps.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopAllNotes = this.stopAllNotes.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  componentDidMount() {
    // TODO: unbind this on unmount

    window.addEventListener('keydown', (event) => {
      const note = getNoteFromKey(event.key);
      if (note !== null) {
        this.startNote(note);

        this.setState({
          notes: Object.assign({}, this.state.notes, { [note]: true }),
        });
      }
    });

    window.addEventListener('keyup', (event) => {
      const note = getNoteFromKey(event.key);
      if (note !== null) {
        this.stopNote(note);

        this.setState({
          notes: Object.assign({}, this.state.notes, { [note]: false }),
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO
  }

  startNote(note) {
    if (this.notes[note]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note, this.state.numOctaves, this.state.numSteps);
    oscillator.connect(this.gainNode);
    oscillator.start(0);

    console.log('playing frequency: ', oscillator.frequency.value);

    this.notes[note] = oscillator;
  }

  stopAllNotes() {
    Object.keys(this.notes).forEach((note) => {
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

  onChangeNumOctaves(event) {
    this.stopAllNotes();
    this.setState({
      numOctaves: parseInt(event.target.value, 10),
    });
  }

  onChangeNumSteps(event) {
    this.stopAllNotes();
    this.setState({
      numSteps: parseInt(event.target.value, 10),
    });
  }

  // TODO: save chord in state
  onChangeChord(event) {
    this.stopAllNotes();
    const notes = event.target.value.trim().split(' ').map((token) => {
      return parseInt(token, 10);
    }).filter((int) => !isNaN(int));
    console.log(notes);

    notes.forEach((note) => {
      this.startNote(note);
    });
  }

  render() {
    return (
      <div>
        <h1 className="mb-3">Microtoner</h1>
        <div className="mb-3">
          Divide
          <select value={this.state.numOctaves} onChange={this.onChangeNumOctaves}>
            {
              _.range(MAX_NUM_OCTAVES).map((index) => <option value={index} key={index}>{index} octave</option>)
            }
          </select>
          into
          <select value={this.state.numSteps} onChange={this.onChangeNumSteps}>
            {
              _.range(MAX_NUM_STEPS).map((index) => <option value={index} key={index}>{index} steps</option>)
            }
          </select>
        </div>

        <div>
          <strong>Keyboard</strong>
          {
            _.range(keyRows.length - 1, -1, -1).map((rowIndex) => {
              const keys = keyRows[rowIndex];

              return (
                <div>
                  {
                    keys.split('').map((keyLabel) => {
                      const note = getNoteFromKey(keyLabel);
                      return (
                        <button
                          className="btn"
                          key={note}
                          onClick={this.onClick.bind(this, note)}
                        >
                          {note + 1}<br />
                          {keyLabel}
                        </button>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>

        <div>
          <strong>Chord builder</strong>

          <input type="text" value={this.state.chord} onChange={this.onChangeChord} />
        </div>

        <button onClick={this.stopAllNotes}>Stop</button>
      </div>
    );
  }
}

export default App;
