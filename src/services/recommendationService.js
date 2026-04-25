const getPreferenceScore = (destination, preferences) => preferences[destination?.natureTypeKey] || 0;

const shuffleArray = (items) => {
  const output = [...items];

  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }

  return output;
};

export const rankDestinations = (destinations = [], preferences = {}) => {
  return [...destinations].sort((a, b) => {
    const scoreA = getPreferenceScore(a, preferences);
    const scoreB = getPreferenceScore(b, preferences);

    if (scoreA === scoreB) {
      return a.name.localeCompare(b.name);
    }

    return scoreB - scoreA;
  });
};

export const applyDiscoveryMix = (rankedDestinations = [], randomRatio = 0.3) => {
  if (rankedDestinations.length < 3) {
    return rankedDestinations;
  }

  const randomCount = Math.max(1, Math.round(rankedDestinations.length * randomRatio));
  const weightedCount = Math.max(1, rankedDestinations.length - randomCount);

  const weighted = rankedDestinations.slice(0, weightedCount);
  const randomPool = shuffleArray(rankedDestinations.slice(weightedCount));

  return [...weighted, ...randomPool];
};
