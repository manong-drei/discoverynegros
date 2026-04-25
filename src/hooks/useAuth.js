import { useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
  };
}
