import React from 'react';
import classNames from 'classnames';

import CustomSettings from './CustomSettings';
import EqualTemperamentSettings from './EqualTemperamentSettings';

class Settings extends React.Component {
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
          <div className="float-left">Scale settings</div>
          <div className="float-right">
            <div className="btn-group">
              <button
                className={classNames(
                  'btn btn-sm',
                  useCustomCentValues ? inactiveClass : activeClass,
                )}
                onClick={() => this.toggleCustomSettings(false)}
              >
                Equal temperament
              </button>
              <button
                className={classNames(
                  'btn btn-sm',
                  useCustomCentValues ? activeClass : inactiveClass,
                )}
                onClick={() => this.toggleCustomSettings(true)}
              >
                Custom tuning
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {useCustomCentValues ? (
            <CustomSettings config={this.props.config} setConfig={this.props.setConfig} />
          ) : (
            <EqualTemperamentSettings config={this.props.config} setConfig={this.props.setConfig} />
          )}
        </div>
      </div>
    );
  }
}

export default Settings;
