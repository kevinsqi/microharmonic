// TODO: fix errant notes playing when ctrl+tabbing, etc

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Oscillator from './audio/Oscillator';
import { getCustomCentsForNote, CENTS_IN_OCTAVE } from './noteHelpers';

const KEY_LABELS_IN_ROWS = [
  `zxcvbnm,./`,
  `asdfghjkl;`,
  `qwertyuiop`,
  `1234567890`,
];

const KEY_LABELS = KEY_LABELS_IN_ROWS.join('');  // keys in ascending pitch order

function getOffsetFromKeyLabel(keyLabel) {
  const offset = KEY_LABELS.indexOf(keyLabel);
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

    this.oscillator = new Oscillator({
      audioContext: props.audioContext,
      gain: props.gain,
    });
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

  startNote = (note) => {
    const freq = this.props.getFrequencyForNote(note);
    this.oscillator.start(freq);
  };

  stopNote = (note) => {
    const freq = this.props.getFrequencyForNote(note);
    this.oscillator.stop(freq);
  };

  onKeyDown(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    if (note !== null) {
      this.startNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: true }),
      });
    }
  }

  onKeyUp(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    if (note !== null) {
      this.stopNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: false }),
      });
    }
  }

  getCentsForNote(note) {
    if (this.props.config.useCustomCentValues) {
      return getCustomCentsForNote(note, this.props.config.customCentValues);
    } else {
      return (CENTS_IN_OCTAVE * this.props.config.numOctaves) / this.props.config.numSteps * note;
    }
  }

  getNoteFromKeyLabel(keyLabel) {
    const offset = getOffsetFromKeyLabel(keyLabel);
    return this.props.getNoteFromOffset(offset);
  }

  renderKey(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    const cents = this.getCentsForNote(note);
    return (
      <div className="col col-sm-1" key={note}>
        <button
          className={
            classNames('btn btn-key', {
              'btn-octave': cents % CENTS_IN_OCTAVE === 0,
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
          <small>{Math.round(cents)}</small><br />
          <small className="text-muted">{keyLabel}</small>
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          _.range(KEY_LABELS_IN_ROWS.length - 1, -1, -1).map((rowIndex) => {
            const keyLabels = KEY_LABELS_IN_ROWS[rowIndex].split('');

            return (
              <div
                className={classNames(
                  'row',
                  'no-gutters',
                  'keyrow',
                  `keyrow-${rowIndex}`
                )}
                key={rowIndex}
              >
                {keyLabels.map((keyLabel) => this.renderKey(keyLabel))}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Keyboard;
