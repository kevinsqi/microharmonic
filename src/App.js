import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// note - number of half steps up from A440
function getFrequency(note) {
  return 440 * Math.pow(2, note * (1 / 12));
}

class App extends Component {

  onClick(note) {
    var context = new window.AudioContext();

    var oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = getFrequency(note);
    oscillator.connect(context.destination);
    oscillator.start(0);
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
