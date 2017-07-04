import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

// note - number of half steps up from A440
function getFrequency(note, stepsPerOctave) {
  return 440 * Math.pow(2, note * (1 / stepsPerOctave));
}

class App extends Component {
  constructor(props) {
    super(props);

    // TODO: have current active keys represented in state
    this.state = {
      stepsPerOctave: 12,
    };

    this.ctx = new window.AudioContext();
    this.nodes = {};

    this.onChangeStepsPerOctave = this.onChangeStepsPerOctave.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  startNote(note) {
    var oscillator = this.ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note, this.state.stepsPerOctave);
    oscillator.connect(this.ctx.destination);
    oscillator.start(0);

    console.log('starting frequency: ', oscillator.frequency.value);

    this.nodes[note] = oscillator;
  }

  stopNote(note) {
    this.nodes[note].stop(0);
    this.nodes[note].disconnect();
    this.nodes[note] = null;
  }

  onClick(note) {
    if (this.nodes[note]) {
      this.stopNote(note);
    } else {
      this.startNote(note);
    }
  }

  onChangeStepsPerOctave(event) {
    this.setState({
      stepsPerOctave: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <select value={this.state.stepsPerOctave} onChange={this.onChangeStepsPerOctave}>
          {
            _.range(24).map((index) => <option value={index} key={index}>{index}</option>)
          }
        </select>
        <button onClick={this.onClick.bind(this, 0)}>C</button>
        <button onClick={this.onClick.bind(this, 1)}>D</button>
        <button onClick={this.onClick.bind(this, 2)}>E</button>
      </div>
    );
  }
}

export default App;
