import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import update from 'immutability-helper';
import AudioSequencer from './audio/Sequencer';

// TODO: pass cent values to sequencer for display
class Sequencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sequences: this.getInitialSequences(),
    };
  }

  // TODO: refactor, move sequences from state to props?
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.frequencies, nextProps.frequencies)) {
      this.setState({
        sequences: this.getInitialSequences(nextProps.frequencies),
      });
    }
  }

  onClickPlay = () => {
    const normalizedSequences = Object.keys(this.state.sequences).map((offset) => {
      const activeTimeIndexes = Object.keys(this.state.sequences[offset]).filter((timeIndex) => {
        return this.state.sequences[offset][timeIndex];
      });

      const frequency = this.props.frequencies[offset % this.props.frequencies.length];
      return activeTimeIndexes.map((timeIndex) => {
        return [frequency, timeIndex * 0.5, 0.5];
      });
    }).filter((sequence) => {
      return sequence.length > 0
    });

    console.log('onClickPlay', normalizedSequences, this.props.frequencies);
    const audioSequencer = new AudioSequencer({
      audioContext: this.props.audioContext,
      sequences: normalizedSequences,
      gain: this.props.gain
    });
    audioSequencer.play();
  };

  onClickReset = () => {
    this.setState({
      sequences: this.getInitialSequences(),
    });
  };

  onClickSequenceItem = (offset, timeIndex) => {
    console.log('onClickSequenceItem', offset, timeIndex);

    const currentlyActive = this.state.sequences[offset][timeIndex];

    this.setState({
      sequences: update(this.state.sequences, {
        [offset]: {
          [timeIndex]: { $set: !currentlyActive }
        }
      }),
    }, () => console.log(this.state));
  };

  getNumDisplaySteps(frequencies) {
    return (frequencies || this.props.frequencies).length;
  }

  getNumSequenceItems() {
    return 16;
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

  render() {
    return (
      <div>
        <p><strong>This is a work in progress!</strong></p>

        <div className="btn-group mb-3">
          <button className="btn btn-primary" onClick={this.onClickPlay}>Play once</button>
          <button className="btn btn-secondary" onClick={this.onClickReset}>Reset</button>
        </div>

        {
          _.range(this.getNumDisplaySteps() - 1, -1, -1).map((offset) => {
            return (
              <div className="row no-gutters" key={offset}>
                <div className="col-1">
                  <div className="text-right pr-2 py-1">{offset}</div>
                </div>
                <div className="col">
                  <div className="row no-gutters">
                    {
                      _.range(this.getNumSequenceItems()).map((timeIndex) => {
                        return (
                          <div
                            className={classNames('col', 'sequence-item', 'py-1', { 'sequence-item-active': this.state.sequences[offset][timeIndex] })}
                            key={timeIndex}
                            onClick={this.onClickSequenceItem.bind(this, offset, timeIndex)}
                          >
                            <div className="text-center">{timeIndex}</div>
                          </div>
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

export default Sequencer;
