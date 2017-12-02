import React from 'react';
import _ from 'lodash';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

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

  renderStepSettings() {
    return (
      <div>
        <div>
          <label>
            <small className="font-weight-bold text-muted">
              Octave division
            </small>
          </label>
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
          <label>
            <small className="font-weight-bold text-muted">
              Notes to include
            </small>
          </label>
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
          <label className="text-muted">
            <small className="font-weight-bold text-muted">Frequency of lowest note</small>
          </label>
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
      <div>Custom</div>
    );
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <div className="float-left">
            Scale settings
          </div>
          <div className="float-right">
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => this.setState({ showCustomSettings: false })}
              >
                Equal temperament
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => this.setState({ showCustomSettings: true })}
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
