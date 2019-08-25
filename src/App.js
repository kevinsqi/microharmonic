import React from 'react';
import _ from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Composer from './Composer';
import Footer from './Footer';
import GAListener from './GAListener';
import Header from './Header';
import Keyboard from './Keyboard';
import KeyboardLegend from './KeyboardLegend';
import Settings from './Settings';
import Tutorial from './Tutorial';
import { CENTS_IN_OCTAVE } from './noteHelpers';

const GAIN_VALUE = 0.1;

function SettingsWrapper(props) {
  return (
    <div className="container d-flex flex-column height-full">
      <div className="flex-1">{props.children}</div>
      <div className="mt-5">
        <Settings config={props.config} setConfig={props.setConfig} />
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        useCustomCentValues: false,
        // TODO: make this be in sync with CustomSettings preset
        customCentValues: _.range(0, CENTS_IN_OCTAVE, 100),
        lowestNote: 'c4',
        numOctaves: 1,
        numSteps: 24,
        selectedNotes: {},
      },
    };
  }

  setConfig = (config) => {
    this.setState({
      config: Object.assign({}, this.state.config, config),
    });
  };

  render() {
    return (
      <Router>
        <GAListener trackingId="UA-145919044-1">
          <div className="d-flex flex-column height-full">
            <Header />
            <div className="flex-1" style={{ paddingTop: 80 }}>
              <Route
                exact
                path="/"
                render={() => (
                  <SettingsWrapper config={this.state.config} setConfig={this.setConfig}>
                    <div className="d-flex flex-column">
                      <Keyboard className="mx-auto" config={this.state.config} gain={GAIN_VALUE} />
                      <div className="mx-auto" style={{ paddingTop: 80 }}>
                        <KeyboardLegend />
                      </div>
                    </div>
                  </SettingsWrapper>
                )}
              />
              <Route
                exact
                path="/composer"
                render={() => (
                  <SettingsWrapper config={this.state.config} setConfig={this.setConfig}>
                    <Composer config={this.state.config} gain={GAIN_VALUE} />
                  </SettingsWrapper>
                )}
              />
              <Route
                exact
                path="/composer/:shortID"
                render={(props) => (
                  <SettingsWrapper config={this.state.config} setConfig={this.setConfig}>
                    <Composer
                      config={this.state.config}
                      gain={GAIN_VALUE}
                      shortID={props.match.params.shortID}
                    />
                  </SettingsWrapper>
                )}
              />
              <Route exact path="/tutorial" render={() => <Tutorial gain={GAIN_VALUE} />} />
            </div>
            <Footer className="mt-3" />
          </div>
        </GAListener>
      </Router>
    );
  }
}

export default App;
