import { ACTION_WEIGHTS, NATURE_CATEGORIES } from '../constants/categories';

export const createEmptyPreferences = () =>
  NATURE_CATEGORIES.reduce((acc, item) => {
    acc[item.key] = 0;
    return acc;
  }, {});

export const applyInitialPreferences = (selectedKeys = []) => {
  const preferences = createEmptyPreferences();

  selectedKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(preferences, key)) {
      preferences[key] += ACTION_WEIGHTS.initialPreference;
    }
  });

  return preferences;
};

export const updatePreferenceByAction = (preferences, categoryKey, action) => {
  if (!preferences || !Object.prototype.hasOwnProperty.call(preferences, categoryKey)) {
    return preferences;
  }

  const nextPreferences = { ...preferences };

  if (action === 'left') {
    nextPreferences[categoryKey] += ACTION_WEIGHTS.left;
  }

  if (action === 'right') {
    nextPreferences[categoryKey] += ACTION_WEIGHTS.right;
  }

  if (action === 'love') {
    nextPreferences[categoryKey] += ACTION_WEIGHTS.love;
  }

  return nextPreferences;
};

export const reverseActionOnPreference = (preferences, categoryKey, action) => {
  if (!preferences || !Object.prototype.hasOwnProperty.call(preferences, categoryKey)) {
    return preferences;
  }

  const nextPreferences = { ...preferences };

  if (action === 'left') {
    nextPreferences[categoryKey] -= ACTION_WEIGHTS.left;
  }

  if (action === 'right') {
    nextPreferences[categoryKey] -= ACTION_WEIGHTS.right;
  }

  if (action === 'love') {
    nextPreferences[categoryKey] -= ACTION_WEIGHTS.love;
  }

  return nextPreferences;
};
