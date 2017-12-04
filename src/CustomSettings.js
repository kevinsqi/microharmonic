import React from 'react';

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

class CustomSettings extends React.Component {
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

  render() {
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
}

export default CustomSettings;
