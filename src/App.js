// TODO: fix errant notes playing when ctrl+tabbing, etc
// TODO: separate audio stuff into another file, separate from component - see https://github.com/jxnblk/bumpkit/blob/master/demo/bumpkit.js for ex
// TODO: add filter/effect to be similar to sevish-droplet?
// TODO: use immutable.js?

import React, { Component } from 'react';
import _ from 'lodash';
import Keyboard from './Keyboard';
import Sequencer from './Sequencer';
import Settings from './Settings';
import { getFrequency } from './noteHelpers';
import './App.css';

const GAIN_VALUE = 0.1;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minFrequency: 220,
      numOctaves: 1,
      numSteps: 12,
      selectedNotes: {},
    };

    // noreintegrate put in state?
    this.audioContext = new window.AudioContext();

    this.getNoteFromOffset = this.getNoteFromOffset.bind(this);
    this.getFrequencyForNote = this.getFrequencyForNote.bind(this);
    this.setConfig = this.setConfig.bind(this);
  }

  getFrequencyForNote(note) {
    return getFrequency(this.state.minFrequency, note, this.state.numOctaves, this.state.numSteps);
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

  setConfig(config) {
    this.setState(config);
  }

  render() {
    return (
      <div className="m-3">
        <h1>Microtoner</h1>
        <div className="mt-3">
          <Settings
            config={this.state}
            setConfig={this.setConfig}
          />
        </div>

        <div className="mt-3">
          <h2 className="h4">Keyboard</h2>
          <p>Octave notes are highlighted</p>
          <Keyboard
            getNoteFromOffset={this.getNoteFromOffset}
            getFrequencyForNote={this.getFrequencyForNote}
            config={this.state}
            audioContext={this.audioContext}
            gain={GAIN_VALUE}
          />
        </div>

        <div className="mt-3">
          <h2 className="h4">Sequencer</h2>
          <Sequencer
            frequencies={this.getStepFrequencies()}
            gain={GAIN_VALUE}
            audioContext={this.audioContext}
          />
        </div>
      </div>
    );
  }
}

export default App;
