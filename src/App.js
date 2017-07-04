import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

// note - number of half steps up from A440
function getFrequency(note, stepsPerOctave) {
  return 440 * Math.pow(2, note * (1 / stepsPerOctave));
}

// TODO: volume control
class App extends Component {
  constructor(props) {
    super(props);

    // TODO: have current active keys represented in state
    this.state = {
      stepsPerOctave: 12,
    };

    this.ctx = new window.AudioContext();
    this.notes = {};

    this.onChangeStepsPerOctave = this.onChangeStepsPerOctave.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopAllNotes = this.stopAllNotes.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  startNote(note) {
    var oscillator = this.ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note, this.state.stepsPerOctave);
    oscillator.connect(this.ctx.destination);
    oscillator.start(0);

    console.log('starting frequency: ', oscillator.frequency.value);

    this.notes[note] = oscillator;
  }

  stopAllNotes() {
    Object.keys(this.notes).map((note) => {
      this.stopNote(note);
    });
  }

  stopNote(note) {
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
