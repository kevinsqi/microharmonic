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
