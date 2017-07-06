import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './App.css';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;
const CENTS_PER_OCTAVE = 1200;

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

function getOffsetFromKey(key) {
  const offset = keySequence.indexOf(key);
  if (offset !== -1) {
    return offset;
  }
  return null;
}

// TODO: separate audio stuff into another file, separate from component - see https://github.com/jxnblk/bumpkit/blob/master/demo/bumpkit.js for ex
// TODO: show cent values instead of ratios
// TODO: nicer sounds - connect to MIDI piano/other instruments, like scala
// TODO: add button to play the whole scale?
// TODO: add filter/effect to be similar to sevish-droplet?
// TODO: test on mobile, touch logic https://raw.githubusercontent.com/stuartmemo/qwerty-hancock/master/dist/qwerty-hancock.js
// TODO: use immutable.js?
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minFrequency: 110,
      numOctaves: 1,
      numSteps: 12,
      activeNotes: {},
      selectedNotes: {},
    };

    this.audioContext = new window.AudioContext();
    this.activeNotes = {};
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.1;
    this.gainNode.connect(this.audioContext.destination);

    this.onChangeSelectedNotes = this.onChangeSelectedNotes.bind(this);
    this.onChangeMinFrequency = this.onChangeMinFrequency.bind(this);
    this.onChangeNumOctaves = this.onChangeNumOctaves.bind(this);
    this.onChangeNumSteps = this.onChangeNumSteps.bind(this);
    this.onClickResetSelectedNotes = this.onClickResetSelectedNotes.bind(this);
    this.startNote = this.startNote.bind(this);
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
    const note = this.getNoteFromKey(key);
    if (note !== null) {
      this.startNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: true }),
      });
    }
  }

  onKeyUp(key) {
    const note = this.getNoteFromKey(key);
    if (note !== null) {
      this.stopNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: false }),
      });
    }
  }

  getCentsForNote(note) {
    return (CENTS_PER_OCTAVE * this.state.numOctaves) / this.state.numSteps * note;
  }

  getNoteFromKey(key) {
    const offset = getOffsetFromKey(key);
    return this.getNoteFromOffset(offset);
  }

  getNoteFromOffset(offset) {
    const sortedNotes = _.sortBy(Object.keys(this.state.selectedNotes).map((str) => parseInt(str, 10)));
    const numNotes = sortedNotes.length;
    if (numNotes > 0) {
      const octaves = Math.floor(offset / numNotes);
      const remainder = offset % numNotes;
      return (octaves * this.state.numSteps) + sortedNotes[remainder];
    } else {
      return offset;
    }
  }

  getFrequencyForNote(note) {
    return getFrequency(this.state.minFrequency, note, this.state.numOctaves, this.state.numSteps);
  }

  getFrequencyRatioForNote(note) {
    return getFrequencyRatio(note, this.state.numOctaves, this.state.numSteps);
  }

  startNote(note) {
    if (this.activeNotes[note]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = this.getFrequencyForNote(note);
    oscillator.connect(this.gainNode);
    oscillator.start(0);

    console.log('playing note', note, 'at frequency', oscillator.frequency.value);

    this.activeNotes[note] = oscillator;
  }

  reset() {
    this.setState({
      selectedNotes: {},
    });
  }

  stopNote(note) {
    if (!this.activeNotes[note]) {
      return;
    }

    this.activeNotes[note].stop(0);
    this.activeNotes[note].disconnect();
    delete this.activeNotes[note];
  }

  onChangeMinFrequency(event) {
    this.reset();
    this.setState({
      minFrequency: parseFloat(event.target.value),
    });
  }

  onChangeNumOctaves(event) {
    this.reset();
    this.setState({
      numOctaves: parseInt(event.target.value, 10),
    });
  }

  onChangeNumSteps(event) {
    this.reset();
    this.setState({
      numSteps: parseInt(event.target.value, 10),
    });
  }

  onChangeSelectedNotes(event) {
    const note = parseInt(event.target.name, 10);
    const value = event.target.checked;

    const selectedNotes = value ? (
      Object.assign({}, this.state.selectedNotes, { [note]: true })
    ) : (
      _.omit(this.state.selectedNotes, note)
    );

    this.setState({
      selectedNotes: selectedNotes,
    });
  }

  onClickResetSelectedNotes() {
    this.reset();
  }

  render() {
    return (
      <div className="m-3">
        <h1 className="mb-3">Microtoner</h1>
        <div className="mb-3">
          <div className="form-inline">
            Divide
            <select className="form-control" value={this.state.numOctaves} onChange={this.onChangeNumOctaves}>
              {
                _.range(MAX_NUM_OCTAVES).map((index) => <option value={index + 1} key={index}>{index + 1} octave</option>)
              }
            </select>
            into
            <select className="form-control" value={this.state.numSteps} onChange={this.onChangeNumSteps}>
              {
                _.range(MAX_NUM_STEPS).map((index) => <option value={index + 1} key={index}>{index + 1} steps</option>)
              }
            </select>
          </div>

          <div className="form-inline">
            Frequency of lowest note:
            <input className="form-control" type="text" value={this.state.minFrequency} onChange={this.onChangeMinFrequency} /> hz
          </div>

          <div className="form-inline">
            Notes to include:

            <button className="btn btn-link" onClick={this.onClickResetSelectedNotes}>All</button>
            {
              _.range(this.state.numSteps).map((note) => {
                return (
                  <label className="ml-3" key={note}>
                    <input
                      className="form-control"
                      type="checkbox"
                      name={note}
                      checked={this.state.selectedNotes[note]}
                      onChange={this.onChangeSelectedNotes}
                    />
                    {note}
                  </label>
                );
              })
            }
          </div>
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
                      const note = this.getNoteFromKey(keyLabel);
                      return (
                        <button
                          className={
                            classNames('btn btn-key', {
                              'btn-secondary': note % (this.state.numSteps / this.state.numOctaves) === 0,
                              'btn-info': this.state.activeNotes[note],
                            })
                          }
                          key={note}
                          onMouseDown={this.onKeyDown.bind(this, keyLabel)}
                          onMouseUp={this.onKeyUp.bind(this, keyLabel)}
                          onMouseLeave={this.onKeyUp.bind(this, keyLabel)}
                        >
                          {note}<br />
                          <small>{Math.round(this.getCentsForNote(note))}</small><br />
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
      </div>
    );
  }
}

export default App;
