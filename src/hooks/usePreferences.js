import { useState } from 'react';
import { createEmptyPreferences } from '../utils/preferenceUtils';

export default function usePreferences(initialPreferences) {
  const [preferences, setPreferences] = useState(initialPreferences || createEmptyPreferences());

  return {
    preferences,
    setPreferences,
  };
}
