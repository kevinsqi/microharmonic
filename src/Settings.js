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
    const activeClass = 'btn-primary';
    const inactiveClass = 'btn-outline-secondary';
    const { useCustomCentValues } = this.props.config;

    return (
      <div>
        <div className="text-center">
          <div className="btn-group btn-group-lg">
            <button
              className={classNames('btn', useCustomCentValues ? inactiveClass : activeClass)}
              onClick={() => this.toggleCustomSettings(false)}
            >
              Equal temperament
            </button>
            <button
              className={classNames('btn', useCustomCentValues ? activeClass : inactiveClass)}
              onClick={() => this.toggleCustomSettings(true)}
            >
              Custom tuning
            </button>
          </div>
        </div>
        <div>
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
