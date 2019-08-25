import React from 'react';
import _ from 'lodash';
import pluralize from 'pluralize';
import classNames from 'classnames';

import Label from './Label';
import { getNoteLabel } from './noteHelpers';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

class EqualTemperamentSettings extends React.Component {
  reset() {
    this.props.setConfig({
      selectedNotes: {},
    });
  }

  onChangeLowestNote = (event) => {
    this.reset();
    this.props.setConfig({
      lowestNote: event.target.value,
    });
  };

  onChangeNumOctaves = (event) => {
    this.reset();
    this.props.setConfig({
      numOctaves: parseInt(event.target.value, 10),
    });
  };

  onChangeNumSteps = (event) => {
    this.reset();
    this.props.setConfig({
      numSteps: parseInt(event.target.value, 10),
    });
  };

  onChangeSelectedNotes = (event) => {
    const note = parseInt(event.target.name, 10);
    const value = event.target.checked;

    const selectedNotes = value
      ? Object.assign({}, this.props.config.selectedNotes, { [note]: true })
      : _.omit(this.props.config.selectedNotes, note);

    this.props.setConfig({
      selectedNotes: selectedNotes,
    });
  };

  onClickResetSelectedNotes = () => {
    this.reset();
  };

  renderStepSettings() {
    return (
      <div>
        <div>
          <Label>Octave division</Label>
        </div>

        <div className="form-inline">
          <select
            className="form-control"
            value={this.props.config.numOctaves}
            onChange={this.onChangeNumOctaves}
          >
            {_.range(MAX_NUM_OCTAVES).map((index) => {
              const label = pluralize('octave', index + 1, true);
              return (
                <option value={index + 1} key={index}>
                  {label}
                </option>
              );
            })}
          </select>
          <span className="mx-2">into</span>
          <select
            className="form-control"
            value={this.props.config.numSteps}
            onChange={this.onChangeNumSteps}
          >
            {_.range(MAX_NUM_STEPS).map((index) => {
              const label = pluralize('step', index + 1, true);
              return (
                <option value={index + 1} key={index}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }

  renderNotePicker() {
    return (
      <div>
        <div>
          <Label>Notes to include</Label>
        </div>

        <div>
          {_.range(this.props.config.numSteps).map((note) => {
            return (
              <label
                className={classNames('mr-1 mb-1', 'NoteLabel', {
                  'NoteLabel--selected': this.props.config.selectedNotes[note],
                })}
                key={note}
              >
                <input
                  className="form-control d-none"
                  type="checkbox"
                  name={note}
                  checked={!!this.props.config.selectedNotes[note]}
                  onChange={this.onChangeSelectedNotes}
                />
                {getNoteLabel(this.props.config, note)}
              </label>
            );
          })}
          <button className="ml-4 btn btn-link" onClick={this.onClickResetSelectedNotes}>
            Reset
          </button>
        </div>
      </div>
    );
  }

  renderLowestNoteSetting() {
    return (
      <div>
        <div>
          <Label>Lowest note</Label>
        </div>
        <div className="form-inline">
          <select
            className="form-control"
            value={this.props.config.lowestNote}
            onChange={this.onChangeLowestNote}
            style={{ width: '60px' }}
          >
            {['c3', 'c4', 'c5', 'c6'].map((noteName) => {
              return (
                <option value={noteName} key={noteName}>
                  {noteName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4 mt-4">{this.renderStepSettings()}</div>
        <div className="col-sm-2 mt-4">{this.renderLowestNoteSetting()}</div>
        <div className="col-sm-6 mt-4">{this.renderNotePicker()}</div>
      </div>
    );
  }
}

export default EqualTemperamentSettings;
