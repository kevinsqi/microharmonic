import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import update from 'immutability-helper';

import audioContext from './audioContext';
import AudioSequencer from './audio/Sequencer';
import {
  getCentsForNote,
  getNoteFromOffset,
  getStepFrequencies,
} from './noteHelpers';

function SequenceItem(props) {
  const onClick = props.selected ? props.onDeselect : props.onSelect;
  // noreintegrate implement with onMouseDown instead?
  return (
    <div
      className={
        classNames('col sequence-item py-1', {
          'sequence-item-selected': props.selected,
          'sequence-item-current': props.current,
        })
      }
      draggable
      onClick={onClick}
      onDragEnter={props.onSelect}
      onDragStart={props.onSelect}
    />
  );
}

class Composer extends Component {
  constructor(props) {
    super(props);

    const frequencies = getStepFrequencies(props.config);
    this.state = {
      // TODO: move out of state?
      frequencies,
      // TODO: rename selectedSteps
      sequences: this.getInitialSequences(frequencies),
      currentStep: 0,
    };

    this.updateCurrentStepInterval = null;
    this.currentAudioSequencer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.config, nextProps.config)) {
      this.onStop();
      const frequencies = getStepFrequencies(nextProps.config);
      this.setState({
        frequencies,
        sequences: this.getInitialSequences(frequencies),
      });
    }
  }

  // TODO: refactor
  onClickPlay = () => {
    const stepDuration = this.getStepDuration();
    const numSequenceItems = this.getNumSequenceItems();
    const normalizedSequences = Object.keys(this.state.sequences).map((offset) => {
      const activeTimeIndexes = Object.keys(this.state.sequences[offset]).filter((timeIndex) => {
        return this.state.sequences[offset][timeIndex];
      });

      const frequency = this.state.frequencies[offset % this.state.frequencies.length];
      return activeTimeIndexes.map((timeIndex) => {
        return [frequency, timeIndex * stepDuration, stepDuration];
      });
    }).filter((sequence) => {
      return sequence.length > 0
    });

    this.currentAudioSequencer = new AudioSequencer({
      audioContext: audioContext,
      sequences: normalizedSequences,
      totalDuration: numSequenceItems * stepDuration,
      gain: this.props.gain,
    });
    this.currentAudioSequencer.play();

    this.updateCurrentStepInterval = setInterval(() => {
      this.setState({
        currentStep: (this.state.currentStep + 1) % numSequenceItems,
      });
    }, stepDuration * 1000);
  };

  onClear = (frequencies) => {
    this.setState({
      sequences: this.getInitialSequences(frequencies),
    });
  };

  onClickClear = () => {
    this.onStop();
    this.onClear(this.state.frequencies);
  };

  onStop = () => {
    this.setState({
      currentStep: 0,
    });
    clearInterval(this.updateCurrentStepInterval);
    this.currentAudioSequencer.stop();
  };

  onSelectItem = (offset, timeIndex, value) => {
    this.setState({
      sequences: update(this.state.sequences, {
        [offset]: {
          [timeIndex]: { $set: value }
        }
      }),
    });
  };

  getNumDisplaySteps(frequencies) {
    return frequencies.length;
  }

  getNumSequenceItems() {
    return 16;
  }

  getStepDuration() {
    return 0.2;
  }

  getInitialSequences(frequencies) {
    const sequences = {};
    _.range(this.getNumDisplaySteps(frequencies)).forEach((offset) => {
      sequences[offset] = {};
      _.range(this.getNumSequenceItems()).forEach((timeIndex) => {
        sequences[offset][timeIndex] = false;
      });
    });
    return sequences;
  }

  // TODO refactor subcomponents
  render() {
    return (
      <div>
        <div className="btn-group mb-3">
          <button className="btn btn-primary" onClick={this.onClickPlay}>Play</button>
          <button
            className="btn btn-secondary"
            disabled={!this.currentAudioSequencer}
            onClick={this.onStop}
          >
            Stop
          </button>
          <button className="btn btn-outline-secondary" onClick={this.onClickClear}>Clear</button>
        </div>

        {
          _.range(this.getNumDisplaySteps(this.state.frequencies) - 1, -1, -1).map((offset) => {
            const note = getNoteFromOffset(this.props.config, offset);
            const cents = getCentsForNote(this.props.config, note);
            return (
              <div className="row no-gutters" key={offset}>
                <div className="col-1">
                  <div className="text-right pr-2 py-1 line-height-1">
                    {note}<br />
                    <small>{Math.round(cents)}</small>
                  </div>
                </div>
                <div className="col">
                  <div className="row no-gutters">
                    {
                      _.range(this.getNumSequenceItems()).map((timeIndex) => {
                        const isSelected = this.state.sequences[offset][timeIndex];
                        return (
                          <SequenceItem
                            selected={isSelected}
                            current={timeIndex === this.state.currentStep}
                            onSelect={this.onSelectItem.bind(this, offset, timeIndex, true)}
                            onDeselect={this.onSelectItem.bind(this, offset, timeIndex, false)}
                            key={timeIndex}
                          />
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Composer;
