import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

function Label(props) {
  return (
    <label>
      <small className="font-weight-bold text-muted">
        {props.children}
      </small>
    </label>
  );
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomSettings: false,
    };
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
  // TODO: add validation
  onChangeCustomCentValues = (event) => {
    const centValues = event.target.value.split(/\s/).map((value) => parseInt(value, 10));
    this.props.setConfig({
      customCentValues: centValues,
    });
  };

  renderStepSettings() {
    return (
      <div>
        <div>
          <Label>Octave division</Label>
        </div>

        <div className="form-inline">
          <select
            className="form-control form-control-sm"
            value={this.props.config.numOctaves}
            onChange={this.onChangeNumOctaves}
          >
            {
              _.range(MAX_NUM_OCTAVES).map((index) => <option value={index + 1} key={index}>{index + 1} octave</option>)
            }
          </select>
          into{' '}
          <select className="form-control form-control-sm" value={this.props.config.numSteps} onChange={this.onChangeNumSteps}>
            {
              _.range(MAX_NUM_STEPS).map((index) => <option value={index + 1} key={index}>{index + 1} steps</option>)
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
          <button className="btn btn-link" onClick={this.onClickResetSelectedNotes}>All</button>
          {
            _.range(this.props.config.numSteps).map((note) => {
              return (
                <label className="ml-3" key={note}>
                  <input
                    className="form-control form-control-sm"
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
            className="form-control form-control-sm"
            type="text"
            value={this.props.config.minFrequency}
            onChange={this.onChangeMinFrequency}
          /> hz
        </div>
      </div>
    );
  }

  renderEqualTemperamentSettings() {
    return (
      <div className="row">
        <div className="col-3">
          {this.renderStepSettings()}
        </div>
        <div className="col-3">
          {this.renderMinFrequencySetting()}
        </div>
        <div className="col-6">
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
        <small className="text-muted">Enter cent values between 0 and 1200, separated by line breaks or spaces</small>
        <textarea
          className="form-control"
          rows="10"
          value={this.props.config.customCentValues.join('\n')}
          onChange={this.onChangeCustomCentValues}
        />
      </div>
    );
  }

  toggleCustomSettings(useCustom) {
    this.setState({
      showCustomSettings: useCustom,
    });
    this.props.setConfig({
      useCustomCentValues: useCustom,
    });
  }

  render() {
    const activeClass = 'btn-outline-primary';
    const inactiveClass = 'btn-outline-secondary';

    return (
      <div className="card">
        <div className="card-header">
          <div className="float-left">
            Scale settings
          </div>
          <div className="float-right">
            <div className="btn-group">
              <button
                className={classNames('btn btn-sm', this.state.showCustomSettings ? inactiveClass : activeClass)}
                onClick={() => this.toggleCustomSettings(false)}
              >
                Equal temperament
              </button>
              <button
                className={classNames('btn btn-sm', this.state.showCustomSettings ? activeClass : inactiveClass)}
                onClick={() => this.toggleCustomSettings(true)}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {
            this.state.showCustomSettings ? (
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
