import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import audioContext from './audioContext';
import Oscillator from './audio/Oscillator';
import {
  getCentsForNote,
  getFrequencyForNote,
  getNoteFromOffset,
  CENTS_IN_OCTAVE,
} from './noteHelpers';

// This has to be in pitch ascending order to be able to use getOffsetFromKeyLabel
const KEY_LABELS_IN_ROWS = [`zxcvbnm,./`, `asdfghjkl;`, `qwertyuiop`, `1234567890`];

const KEY_LABELS = KEY_LABELS_IN_ROWS.join(''); // keys in ascending pitch order

function getOffsetFromKeyLabel(keyLabel) {
  const offset = KEY_LABELS.indexOf(keyLabel);
  if (offset !== -1) {
    return offset;
  }
  return null;
}

// TODO: rename bindEvents => enableKeyboard, and don't show
// keyboard letters if disabled. or remove the prop
class Keyboard extends React.Component {
  static defaultProps = {
    bindEvents: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeNotes: {},
    };

    this.oscillator = new Oscillator({
      audioContext: audioContext,
      gain: props.gain,
    });
  }

  componentDidMount() {
    if (this.props.bindEvents) {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
    }
  }

  componentWillUnmount() {
    if (this.props.bindEvents) {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
    }
  }

  startNote = (note) => {
    const freq = getFrequencyForNote(this.props.config, note);
    this.oscillator.start(freq);
  };

  stopNote = (note) => {
    const freq = getFrequencyForNote(this.props.config, note);
    this.oscillator.stop(freq);
  };

  onKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    this.onKeyActive(event.key);
  };

  onKeyUp = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    this.onKeyInactive(event.key);
  };

  onKeyActive(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    if (note !== null) {
      this.startNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: true }),
      });
    }
  }

  onKeyInactive(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    if (note !== null) {
      this.stopNote(note);

      this.setState({
        activeNotes: Object.assign({}, this.state.activeNotes, { [note]: false }),
      });
    }
  }

  getNoteFromKeyLabel(keyLabel) {
    const offset = getOffsetFromKeyLabel(keyLabel);
    return getNoteFromOffset(this.props.config, offset);
  }

  renderKey(keyLabel) {
    const note = this.getNoteFromKeyLabel(keyLabel);
    const cents = getCentsForNote(this.props.config, note);
    return (
      <button
        className={classNames('Key', {
          'Key--octave': cents % CENTS_IN_OCTAVE === 0,
          'Key--active': this.state.activeNotes[note],
        })}
        onMouseDown={this.onKeyActive.bind(this, keyLabel)}
        onMouseUp={this.onKeyInactive.bind(this, keyLabel)}
        onMouseLeave={this.onKeyInactive.bind(this, keyLabel)}
        onTouchStart={this.onKeyActive.bind(this, keyLabel)}
        onTouchCancel={this.onKeyInactive.bind(this, keyLabel)}
        onTouchEnd={this.onKeyInactive.bind(this, keyLabel)}
      >
        {note}
        <br />
        <small>{Math.round(cents)}</small>
        <br />
        <small className="text-muted">{keyLabel}</small>
      </button>
    );
  }

  render() {
    const reversedRowIndexes = _.range(KEY_LABELS_IN_ROWS.length - 1, -1, -1);
    return (
      <div className={classNames('Keyboard', this.props.className)}>
        {reversedRowIndexes.map((rowIndex) => {
          const keyLabels = KEY_LABELS_IN_ROWS[rowIndex].split('');
          return (
            <div className={classNames('Keyrow', `Keyrow--${rowIndex}`)} key={rowIndex}>
              {keyLabels.map((keyLabel) => this.renderKey(keyLabel))}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Keyboard;
