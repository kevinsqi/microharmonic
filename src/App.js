import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// note - number of half steps up from A440
function getFrequency(note) {
  return 440 * Math.pow(2, note * (1 / 12));
}

class App extends Component {
  constructor(props) {
    super(props);

    this.ctx = new window.AudioContext();
    this.nodes = {};

    this.startNote = this.startNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  startNote(note) {
    var oscillator = this.ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note);
    oscillator.connect(this.ctx.destination);
    oscillator.start(0);

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

  render() {
    return (
      <div>
        <button onClick={this.onClick.bind(this, 0)}>C</button>
        <button onClick={this.onClick.bind(this, 1)}>D</button>
        <button onClick={this.onClick.bind(this, 2)}>E</button>
      </div>
    );
  }
}

export default App;
