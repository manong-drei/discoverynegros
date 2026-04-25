import { useState } from 'react';

export default function useSwipe() {
  const [lastSwipeAction, setLastSwipeAction] = useState(null);

  const rememberSwipe = (actionPayload) => {
    setLastSwipeAction(actionPayload);
  };

  const clearLastSwipe = () => {
    setLastSwipeAction(null);
  };

  return {
    lastSwipeAction,
    rememberSwipe,
    clearLastSwipe,
  };
}
