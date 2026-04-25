export const NATURE_CATEGORIES = [
  { key: 'beaches', label: 'Beaches' },
  { key: 'waterfalls', label: 'Waterfalls' },
  { key: 'mountains', label: 'Mountains' },
  { key: 'rivers', label: 'Rivers' },
  { key: 'campsites', label: 'Campsites' },
  { key: 'natureParks', label: 'Nature Parks' },
  { key: 'scenicSpots', label: 'Scenic Spots' },
];

export const ACTION_WEIGHTS = {
  initialPreference: 1,
  left: -1,
  right: 1,
  love: 3,
};

export const MAX_UNDOS_PER_DAY = 3;

export const RECOMMENDATION_RATIO = {
  preferenceBased: 0.7,
  randomDiscovery: 0.3,
};

export default NATURE_CATEGORIES;
