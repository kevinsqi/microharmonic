// TODO: split equal temp settings and custom into separate components

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import pluralize from 'pluralize';

import { CENTS_IN_OCTAVE } from './noteHelpers';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

function Label(props) {
  return (
    <label>
      <small className="font-weight-bold text-muted uppercase">
        {props.children}
      </small>
    </label>
  );
}

function parseCustomCentValuesStr(str) {
  const values = str.trim().split(/\s+/).map((value) => parseFloat(value)).sort((a, b) => a - b);

  if (values.some((value) => isNaN(value))) {
    throw new Error('Has invalid value which is not a number');
  } else if (values.some((value) => value < 0 || value > CENTS_IN_OCTAVE)) {
    throw new Error('Has out of range cent value (must be between 0 and 1200)');
  }
  return values;
}

function stringifyCustomCentValues(values) {
  return values.join('\n');
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customCentValuesStr: stringifyCustomCentValues(props.config.customCentValues),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.customCentValuesStr !== nextProps.config.customCentValues) {
      this.setState({
        customCentValuesStr: stringifyCustomCentValues(nextProps.config.customCentValues),
      });
    }
  }

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

  // TODO: sort
  // TODO: add validation of NaN, <1200, etc
  onChangeCustomCentValues = (event) => {
    this.setState({
      customCentValuesStr: event.target.value,
    });
  };

  onSaveCustomCentValues = (event) => {
    try {
      const values = parseCustomCentValuesStr(this.state.customCentValuesStr);
      this.props.setConfig({
        customCentValues: values,
      });
    } catch (error) {
      alert('Sorry, there was an error interpreting these values.');
    }
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

  renderEqualTemperamentSettings() {
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

  renderCustomSettings() {
    return (
      <div>
        <div>
          <Label>Custom scale tuning</Label>
        </div>
        <small className="text-muted">Enter cent values between 0 and 1200, separated by line breaks</small>
        <textarea
          className="form-control"
          rows="10"
          value={this.state.customCentValuesStr}
          onChange={this.onChangeCustomCentValues}
        />
        <div className="mt-3">
          <button className="btn btn-primary" onClick={this.onSaveCustomCentValues}>Save</button>
        </div>
      </div>
    );
  }

  toggleCustomSettings(useCustom) {
    this.props.setConfig({
      useCustomCentValues: useCustom,
    });
  }

  render() {
    const activeClass = 'btn-outline-primary';
    const inactiveClass = 'btn-outline-secondary';
    const { useCustomCentValues } = this.props.config;

    return (
      <div className="card">
        <div className="card-header">
          <div className="float-left">
            Scale settings
          </div>
          <div className="float-right">
            <div className="btn-group">
              <button
                className={classNames('btn btn-sm', useCustomCentValues ? inactiveClass : activeClass)}
                onClick={() => this.toggleCustomSettings(false)}
              >
                Equal temperament
              </button>
              <button
                className={classNames('btn btn-sm', useCustomCentValues ? activeClass : inactiveClass)}
                onClick={() => this.toggleCustomSettings(true)}
              >
                Custom tuning
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {
            useCustomCentValues ? (
              this.renderCustomSettings()
            ) : (
              this.renderEqualTemperamentSettings()
            )
          }
        </div>
      </div>
    );
  }
}

export default Settings;
