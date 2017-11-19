function getFrequencyRatio(note, numOctaves, numSteps) {
  return Math.pow(2, note * (numOctaves / numSteps))
}

export function getFrequency(rootFrequency, note, numOctaves, numSteps) {
  return rootFrequency * getFrequencyRatio(note, numOctaves, numSteps);
}
