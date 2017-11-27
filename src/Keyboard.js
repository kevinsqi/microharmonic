// TODO: separate audio stuff into another file, separate from component - see https://github.com/jxnblk/bumpkit/blob/master/demo/bumpkit.js for ex
// TODO: fix errant notes playing when ctrl+tabbing, etc

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

const keyRows = [
  `zxcvbnm,./`,
  `asdfghjkl;`,
  `qwertyuiop`,
  `1234567890`,
];
const keySequence = keyRows.join('');  // keys in ascending pitch order

const CENTS_PER_OCTAVE = 1200;

function getOffsetFromKey(key) {
  const offset = keySequence.indexOf(key);
  if (offset !== -1) {
    return offset;
  }
  return null;
}

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: {},
    };

    this.activeNotes = {};
    this.gainNode = props.audioContext.createGain();
    this.gainNode.gain.value = props.gain;
    this.gainNode.connect(props.audioContext.destination);
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
    return (CENTS_PER_OCTAVE * this.props.config.numOctaves) / this.props.config.numSteps * note;
  }

  getNoteFromKey(key) {
    const offset = getOffsetFromKey(key);
    return this.props.getNoteFromOffset(offset);
  }

  startNote = (note) => {
    if (this.activeNotes[note]) {
      return;
    }

    let oscillator = this.props.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = this.props.getFrequencyForNote(note);
    oscillator.connect(this.gainNode);
    oscillator.start(0);

    console.log('playing note', note, 'at frequency', oscillator.frequency.value);

    this.activeNotes[note] = oscillator;
  };

  stopNote = (note) => {
    if (!this.activeNotes[note]) {
      return;
    }

    this.activeNotes[note].stop(0);
    this.activeNotes[note].disconnect();
    delete this.activeNotes[note];
  };

  render() {
    return (
      <div>
        {
          _.range(keyRows.length - 1, -1, -1).map((rowIndex) => {
            const keys = keyRows[rowIndex];

            return (
              <div className={classNames('row', 'no-gutters', 'keyrow', `keyrow-${rowIndex}`)} key={rowIndex}>
                {
                  keys.split('').map((keyLabel) => {
                    const note = this.getNoteFromKey(keyLabel);
                    return (
                      <div className="col col-sm-1" key={note}>
                        <button
                          className={
                            classNames('btn btn-key', {
                              'btn-octave': note % (this.props.config.numSteps / this.props.config.numOctaves) === 0,
                              'btn-active': this.state.activeNotes[note],
                            })
                          }
                          onMouseDown={this.onKeyDown.bind(this, keyLabel)}
                          onMouseUp={this.onKeyUp.bind(this, keyLabel)}
                          onMouseLeave={this.onKeyUp.bind(this, keyLabel)}
                          onTouchStart={this.onKeyDown.bind(this, keyLabel)}
                          onTouchCancel={this.onKeyUp.bind(this, keyLabel)}
                          onTouchEnd={this.onKeyUp.bind(this, keyLabel)}
                        >
                          {note}<br />
                          <small>{Math.round(this.getCentsForNote(note))}</small><br />
                          <small className="text-muted">{keyLabel}</small>
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Keyboard;
