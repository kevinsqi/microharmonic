// TODO: add filter/effect to be similar to sevish-droplet?

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
      config: {
        minFrequency: 220,
        numOctaves: 1,
        numSteps: 12,
        selectedNotes: {},
      },
    };

    this.audioContext = new window.AudioContext();
  }

  getFrequencyForNote = (note) => {
    return getFrequency(
      this.state.config.minFrequency,
      note,
      this.state.config.numOctaves,
      this.state.config.numSteps,
    );
  };

  getStepFrequencies() {
    return _.range(this.state.config.numSteps + 1).map((offset) => {
      const note = this.getNoteFromOffset(offset);
      return this.getFrequencyForNote(note);
    });
  }

  getNoteFromOffset = (offset) => {
    // Notes are a numeric index into the microtone scale.
    // For example, given a standard 12 EDO scale, note 0 corresponds to minFrequency, note 12 corresponds
    // to 1200 cents above minFrequency, etc.
    //
    // Because you can select specific notes to include in the scale with state.config.selectedNotes,
    // we have offset which is slightly different from notes.
    // For example, if selectedNotes == {0, 3, 6}, offset 0 corresponds to note 0, offset 2 corresponds to note 6,
    // and offset 3 corresponds to note 12.
    const sortedNotes = _.sortBy(Object.keys(this.state.config.selectedNotes).map((str) => parseInt(str, 10)));
    const numNotes = sortedNotes.length;
    if (numNotes > 0) {
      const octaves = Math.floor(offset / numNotes);
      const remainder = offset % numNotes;
      return (octaves * this.state.config.numSteps) + sortedNotes[remainder];
    } else {
      return offset;
    }
  };

  setConfig = (config) => {
    this.setState({
      config: Object.assign({}, this.state.config, config),
    });
  };

  render() {
    return (
      <div className="m-3">
        <h1>Microtonal</h1>

        <div className="mt-3">
          <Settings
            config={this.state.config}
            setConfig={this.setConfig}
          />
        </div>

        <div className="mt-3">
          <h2 className="h4">Keyboard</h2>
          <p>Octave notes are highlighted</p>
          <Keyboard
            getNoteFromOffset={this.getNoteFromOffset}
            getFrequencyForNote={this.getFrequencyForNote}
            config={this.state.config}
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
