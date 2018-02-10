import _ from 'lodash';

export const CENTS_IN_OCTAVE = 1200;

function getFrequencyRatio(note, numOctaves, numSteps) {
  return Math.pow(2, note * (numOctaves / numSteps))
}

export function getFrequency(rootFrequency, note, numOctaves, numSteps) {
  return rootFrequency * getFrequencyRatio(note, numOctaves, numSteps);
}

export function getFrequencyFromCents(rootFrequency, cents) {
  return rootFrequency * Math.pow(2, cents / CENTS_IN_OCTAVE);
}

export function getCustomCentsForNote(note, customCentValues) {
  const offset = note % customCentValues.length;
  const centOffset = customCentValues[offset];
  const octave = Math.floor(note / customCentValues.length);
  return (CENTS_IN_OCTAVE * octave) + centOffset;
}

export function getFrequencyForNote(config, note) {
  if (config.useCustomCentValues) {
    const centValue = getCustomCentsForNote(note, config.customCentValues);
    return getFrequencyFromCents(config.minFrequency, centValue);
  } else {
    return getFrequency(
      config.minFrequency,
      note,
      config.numOctaves,
      config.numSteps,
    );
  }
}

export function getStepFrequencies(config) {
  return _.range(config.numSteps + 1).map((offset) => {
    const note = getNoteFromOffset(config, offset);
    return getFrequencyForNote(config, note);
  });
}

// Notes are a numeric index into the microtone scale.
// For example, given a standard 12 EDO scale, note 0 corresponds to minFrequency, note 12 corresponds
// to 1200 cents above minFrequency, etc.
//
// Because you can select specific notes to include in the scale with state.config.selectedNotes,
// we have offset which is slightly different from notes.
// For example, if selectedNotes == {0, 3, 6}, offset 0 corresponds to note 0, offset 2 corresponds to note 6,
// and offset 3 corresponds to note 12.
export function getNoteFromOffset(config, offset) {
  const sortedNotes = _.sortBy(Object.keys(config.selectedNotes).map((str) => parseInt(str, 10)));
  const numNotes = sortedNotes.length;
  if (numNotes > 0) {
    const octaves = Math.floor(offset / numNotes);
    const remainder = offset % numNotes;
    return (octaves * config.numSteps) + sortedNotes[remainder];
  } else {
    return offset;
  }
}
