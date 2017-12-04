import React from 'react';
import classNames from 'classnames';

import EqualTemperamentSettings from './EqualTemperamentSettings';
import Label from './Label';
import { CENTS_IN_OCTAVE } from './noteHelpers';

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
              <EqualTemperamentSettings
                config={this.props.config}
                setConfig={this.props.setConfig}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default Settings;
