import React from 'react';
import _ from 'lodash';

const MAX_NUM_STEPS = 100;
const MAX_NUM_OCTAVES = 10;

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelectedNotes = this.onChangeSelectedNotes.bind(this);
    this.onChangeMinFrequency = this.onChangeMinFrequency.bind(this);
    this.onChangeNumOctaves = this.onChangeNumOctaves.bind(this);
    this.onChangeNumSteps = this.onChangeNumSteps.bind(this);
    this.onClickResetSelectedNotes = this.onClickResetSelectedNotes.bind(this);
  }

  reset() {
    this.props.setConfig({
      selectedNotes: {},
    });
  }

  onChangeMinFrequency(event) {
    this.reset();
    this.props.setConfig({
      minFrequency: parseFloat(event.target.value),
    });
  }

  onChangeNumOctaves(event) {
    this.reset();
    this.props.setConfig({
      numOctaves: parseInt(event.target.value, 10),
    });
  }

  onChangeNumSteps(event) {
    this.reset();
    this.props.setConfig({
      numSteps: parseInt(event.target.value, 10),
    });
  }

  onChangeSelectedNotes(event) {
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
  }

  onClickResetSelectedNotes() {
    this.reset();
  }

  render() {
    return (
      <div>
        <div className="form-inline">
          Divide
          <select className="form-control" value={this.props.config.numOctaves} onChange={this.onChangeNumOctaves}>
            {
              _.range(MAX_NUM_OCTAVES).map((index) => <option value={index + 1} key={index}>{index + 1} octave</option>)
            }
          </select>
          into
          <select className="form-control" value={this.props.config.numSteps} onChange={this.onChangeNumSteps}>
            {
              _.range(MAX_NUM_STEPS).map((index) => <option value={index + 1} key={index}>{index + 1} steps</option>)
            }
          </select>
        </div>

        <div className="form-inline">
          Frequency of lowest note:
          <input className="form-control" type="text" value={this.props.config.minFrequency} onChange={this.onChangeMinFrequency} /> hz
        </div>

        <div className="form-inline">
          Notes to include:

          <button className="btn btn-link" onClick={this.onClickResetSelectedNotes}>All</button>
          {
            _.range(this.props.config.numSteps).map((note) => {
              return (
                <label className="ml-3" key={note}>
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
        </div>
      </div>
    );
  }
}

export default Settings;
