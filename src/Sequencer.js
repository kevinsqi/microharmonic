import React, { Component } from 'react';
import _ from 'lodash';

class Sequencer extends Component {
  render() {
    return (
      <div>
        {
          _.range(this.props.numSteps * 2, -1, -1).map((offset) => {
            return (
              <div className="row no-gutters" key={offset}>
                <div className="col-1">
                  <div className="text-right pr-2">{offset}</div>
                </div>
                <div className="col">
                  <div className="row no-gutters">
                    {
                      _.range(16).map((index) => {
                        return (
                          <div className="col sequence-item" key={index}>
                            <div className="text-center text-muted">{index}</div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Sequencer;
