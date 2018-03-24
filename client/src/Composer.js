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

function buildSequences({
  selectedSteps,
  frequencies,
  stepDuration,
}) {
  return Object.keys(selectedSteps).map((offset) => {
    const selectedStepIndexes = Object.keys(selectedSteps[offset]).filter((timeIndex) => {
      return selectedSteps[offset][timeIndex];
    });
    const frequency = frequencies[offset % frequencies.length];
    return selectedStepIndexes.map((timeIndex) => {
      return [frequency, timeIndex * stepDuration, stepDuration];
    });
  }).filter((sequence) => {
    return sequence.length > 0
  });
}

function Step(props) {
  const onClick = props.selected ? props.onDeselect : props.onSelect;
  // TODO: implement with onMouseDown instead? would change a flag on mouseDown so mouseEnter selects
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
      // TODO: move out of state? create higher order component
      frequencies,
      selectedSteps: this.getInitialSelectedSteps(frequencies),
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
        selectedSteps: this.getInitialSelectedSteps(frequencies),
      });
    }
  }

  onPlay = () => {
    this.onStop();
    const stepDuration = this.getStepDuration();
    const numSteps = this.getNumSteps();
    const sequences = buildSequences({
      selectedSteps: this.state.selectedSteps,
      frequencies: this.state.frequencies,
      stepDuration,
    });
    this.currentAudioSequencer = new AudioSequencer({
      audioContext: audioContext,
      sequences: sequences,
      totalDuration: numSteps * stepDuration,
      gain: this.props.gain,
    });
    this.currentAudioSequencer.play();

    this.updateCurrentStepInterval = setInterval(() => {
      this.setState({
        currentStep: (this.state.currentStep + 1) % numSteps,
      });
    }, stepDuration * 1000);
  };

  onClear = (frequencies) => {
    this.setState({
      selectedSteps: this.getInitialSelectedSteps(frequencies),
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

    if (this.currentAudioSequencer) {
      this.currentAudioSequencer.stop();
    }
  };

  onSelectItem = (offset, timeIndex, value) => {
    this.setState({
      selectedSteps: update(this.state.selectedSteps, {
        [offset]: {
          [timeIndex]: { $set: value }
        }
      }),
    });
  };

  getNumNotes(frequencies) {
    return frequencies.length;
  }

  getNumSteps() {
    return 16;
  }

  getStepDuration() {
    return 0.2;
  }

  getInitialSelectedSteps(frequencies) {
    const selectedSteps = {};
    _.range(this.getNumNotes(frequencies)).forEach((offset) => {
      selectedSteps[offset] = {};
      _.range(this.getNumSteps()).forEach((timeIndex) => {
        selectedSteps[offset][timeIndex] = false;
      });
    });
    return selectedSteps;
  }

  // TODO refactor subcomponents
  render() {
    return (
      <div>
        <div className="btn-group mb-3">
          <button className="btn btn-primary" onClick={this.onPlay}>Play</button>
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
          _.range(this.getNumNotes(this.state.frequencies) - 1, -1, -1).map((offset) => {
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
                      _.range(this.getNumSteps()).map((timeIndex) => {
                        const isSelected = this.state.selectedSteps[offset][timeIndex];
                        return (
                          <Step
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
