import React from 'react';
import _ from 'lodash';
import pluralize from 'pluralize';

import Label from './Label';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

class EqualTemperamentSettings extends React.Component {
  reset() {
    this.props.setConfig({
      selectedNotes: {},
    });
  }

  onChangeMinFrequency = (event) => {
    this.reset();
    this.props.setConfig({
      minFrequency: parseFloat(event.target.value),
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

    const selectedNotes = value ? (
      Object.assign({}, this.props.config.selectedNotes, { [note]: true })
    ) : (
      _.omit(this.props.config.selectedNotes, note)
    );

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
            {
              _.range(MAX_NUM_OCTAVES).map((index) => {
                const label = pluralize('octave', index + 1, true);
                return <option value={index + 1} key={index}>{label}</option>;
              })
            }
          </select>
          <span className="mx-2">
            into
          </span>
          <select className="form-control" value={this.props.config.numSteps} onChange={this.onChangeNumSteps}>
            {
              _.range(MAX_NUM_STEPS).map((index) => {
                const label = pluralize('step', index + 1, true);
                return <option value={index + 1} key={index}>{label}</option>;
              })
            }
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
          {
            _.range(this.props.config.numSteps).map((note) => {
              return (
                <label className="mr-3" key={note}>
                  <input
                    className="form-control"
                    type="checkbox"
                    name={note}
                    checked={!!this.props.config.selectedNotes[note]}
                    onChange={this.onChangeSelectedNotes}
                  />
                  {note}
                </label>
              );
            })
          }
          <button className="btn btn-link" onClick={this.onClickResetSelectedNotes}>All</button>
        </div>
      </div>
    );
  }

  renderMinFrequencySetting() {
    return (
      <div>
        <div>
          <Label>Frequency of lowest note</Label>
        </div>
        <div className="form-inline">
          <input
            className="form-control"
            type="text"
            value={this.props.config.minFrequency}
            onChange={this.onChangeMinFrequency}
            style={{ width: '60px' }}
          />
          <span className="ml-2">hz</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-3">
          {this.renderStepSettings()}
        </div>
        <div className="col-sm-3">
          {this.renderMinFrequencySetting()}
        </div>
        <div className="col-sm-6">
          {this.renderNotePicker()}
        </div>
      </div>
    );
  }
}

export default EqualTemperamentSettings;
