import React from 'react';
import _ from 'lodash';

import Label from './Label';
import { CENTS_IN_OCTAVE } from './noteHelpers';

const DEFAULT_PRESET_NAME = '12_ET';

const PRESETS = [
  {
    name: '12_ET',
    label: '12 tone equal temperament',
    values: _.range(0, CENTS_IN_OCTAVE, 100),
  },
  {
    name: 'just_intonation',
    label: 'Just intonation',
    values: [
      0,
      111.73,
      203.91,
      315.64,
      386.31,
      498.04,
      582.51,
      701.96,
      813.69,
      884.36,
      996.09,
      1088.27,
    ],
  },
];

const PRESETS_MAP = PRESETS.reduce((map, elem) => {
  map[elem.name] = elem;
  return map;
}, {});

function parseCustomCentValuesStr(str) {
  const values = str
    .trim()
    .split(/\s+/)
    .map((value) => parseFloat(value))
    .sort((a, b) => a - b);

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
      presetName: DEFAULT_PRESET_NAME,
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

  onChangePreset = (event) => {
    const presetName = event.target.value;
    const values = PRESETS_MAP[presetName].values;
    this.setState({
      presetName: presetName,
    });
    this.props.setConfig({
      customCentValues: values,
    });
  };

  render() {
    return (
      <div className="mt-4">
        <Label>Custom scale tuning</Label>
        <div className="row">
          <div className="col-sm-6">
            <small className="text-muted">
              Enter cent values between 0 and 1200, separated by line breaks
            </small>
            <textarea
              className="form-control"
              rows="10"
              value={this.state.customCentValuesStr}
              onChange={this.onChangeCustomCentValues}
            />
            <div className="mt-3">
              <button className="btn btn-primary" onClick={this.onSaveCustomCentValues}>
                Apply
              </button>
            </div>
          </div>
          <div className="col-sm-6">
            <small className="text-muted">...or select a preset:</small>
            <select
              className="form-control"
              value={this.state.presetName}
              onChange={this.onChangePreset}
            >
              {PRESETS.map((preset) => (
                <option value={preset.name} key={preset.name}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomSettings;
