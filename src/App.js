import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;
const ROOT_FREQUENCY = 55;

const keyRows = [
  `zxcvbnm,./`,
  `asdfghjkl;`,
  `qwertyuiop`,
  `1234567890`,
];
const keySequence = keyRows.join('');  // keys in ascending pitch order

function getFrequencyRatio(note, numOctaves, numSteps) {
  return Math.pow(2, note * (numOctaves / numSteps))
}

function getFrequency(rootFrequency, note, numOctaves, numSteps) {
  return rootFrequency * getFrequencyRatio(note, numOctaves, numSteps);
}

function getNoteFromKey(key) {
  const offset = keySequence.indexOf(key);
  if (offset !== -1) {
    return offset; // TODO: configurable note offset
  }
  return null;
}

// TODO: add filter/effect to be similar to sevish-droplet, nicer sounds
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
      this.onKeyDown(event.key);
    });

    window.addEventListener('keyup', (event) => {
      this.onKeyUp(event.key);
    });
  }

  onKeyDown(key) {
    const note = getNoteFromKey(key);
    if (note !== null) {
      this.startNote(note);

      this.setState({
        notes: Object.assign({}, this.state.notes, { [note]: true }),
      });
    }
  }

  onKeyUp(key) {
    const note = getNoteFromKey(key);
    if (note !== null) {
      this.stopNote(note);

      this.setState({
        notes: Object.assign({}, this.state.notes, { [note]: false }),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO
  }

  getFrequencyForNote(note) {
    return getFrequency(ROOT_FREQUENCY, note, this.state.numOctaves, this.state.numSteps);
  }

  getFrequencyRatioForNote(note) {
    return getFrequencyRatio(note, this.state.numOctaves, this.state.numSteps);
  }

  startNote(note) {
    if (this.notes[note]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = this.getFrequencyForNote(note);
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
      <div className="m-3">
        <h1 className="mb-3">Microtoner</h1>
        <div className="mb-3">
          Divide
          <select value={this.state.numOctaves} onChange={this.onChangeNumOctaves}>
            {
              _.range(MAX_NUM_OCTAVES).map((index) => <option value={index + 1} key={index}>{index + 1} octave</option>)
            }
          </select>
          into
          <select value={this.state.numSteps} onChange={this.onChangeNumSteps}>
            {
              _.range(MAX_NUM_STEPS).map((index) => <option value={index + 1} key={index}>{index + 1} steps</option>)
            }
          </select>
        </div>

        <div>
          <h2 className="h4">Keyboard</h2>
          <p>Octave notes are highlighted</p>
          {
            _.range(keyRows.length - 1, -1, -1).map((rowIndex) => {
              const keys = keyRows[rowIndex];

              return (
                <div className={`keyrow-${rowIndex}`} key={rowIndex}>
                  {
                    keys.split('').map((keyLabel) => {
                      const note = getNoteFromKey(keyLabel);
                      return (
                        <button
                          className={
                            classNames('btn btn-key', {
                              'btn-secondary': note % (this.state.numSteps / this.state.numOctaves) === 0,
                              'btn-info': this.state.notes[note],
                            })
                          }
                          key={note}
                          onMouseDown={this.onKeyDown.bind(this, keyLabel)}
                          onMouseUp={this.onKeyUp.bind(this, keyLabel)}
                          onMouseLeave={this.onKeyUp.bind(this, keyLabel)}
                        >
                          {note}<br />
                          <small>{this.getFrequencyRatioForNote(note).toFixed(3)}</small><br />
                          <small className="text-muted">{keyLabel}</small>
                        </button>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>

        <div className="mt-3">
          <h2 className="h4">Chord builder (experimental)</h2>

          <input type="text" value={this.state.chord} onChange={this.onChangeChord} />
          <button onClick={this.stopAllNotes}>Stop chord</button>
        </div>

      </div>
    );
  }
}

export default App;
