import React, { Component } from 'react';
import _ from 'lodash';
import Keyboard from './Keyboard';
import Sequencer from './Sequencer';
import './App.css';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;
const GAIN_VALUE = 0.1;

function getFrequencyRatio(note, numOctaves, numSteps) {
  return Math.pow(2, note * (numOctaves / numSteps))
}

function getFrequency(rootFrequency, note, numOctaves, numSteps) {
  return rootFrequency * getFrequencyRatio(note, numOctaves, numSteps);
}

// TODO: refactor keyboard into separate component
// TODO: fix errant notes playing when ctrl+tabbing, etc
// TODO: separate audio stuff into another file, separate from component - see https://github.com/jxnblk/bumpkit/blob/master/demo/bumpkit.js for ex
// TODO: add filter/effect to be similar to sevish-droplet?
// TODO: use immutable.js?
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minFrequency: 220,
      numOctaves: 1,
      numSteps: 12,
      selectedNotes: {},
    };

    this.audioContext = new window.AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = GAIN_VALUE;
    this.gainNode.connect(this.audioContext.destination);

    this.onChangeSelectedNotes = this.onChangeSelectedNotes.bind(this);
    this.onChangeMinFrequency = this.onChangeMinFrequency.bind(this);
    this.onChangeNumOctaves = this.onChangeNumOctaves.bind(this);
    this.onChangeNumSteps = this.onChangeNumSteps.bind(this);
    this.onClickResetSelectedNotes = this.onClickResetSelectedNotes.bind(this);
    this.getNoteFromOffset = this.getNoteFromOffset.bind(this);
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

  getFrequencyForNote(note) {
    return getFrequency(this.state.minFrequency, note, this.state.numOctaves, this.state.numSteps);
  }

  getFrequencyRatioForNote(note) {
    return getFrequencyRatio(note, this.state.numOctaves, this.state.numSteps);
  }

  getStepFrequencies() {
    return _.range(this.state.numSteps + 1).map((offset) => {
      const note = this.getNoteFromOffset(offset);
      return this.getFrequencyForNote(note);
    });
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

  reset() {
    this.setState({
      selectedNotes: {},
    });
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
        <h1>Microtoner</h1>
        <div className="mt-3">
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

        <div className="mt-3">
          <h2 className="h4">Keyboard</h2>
          <p>Octave notes are highlighted</p>
          <Keyboard
            getNoteFromOffset={this.getNoteFromOffset}
          />
        </div>

        <div className="mt-3">
          <h2 className="h4">Sequencer</h2>
          <Sequencer frequencies={this.getStepFrequencies()} gain={GAIN_VALUE} audioContext={this.audioContext} />
        </div>
      </div>
    );
  }
}

export default App;
