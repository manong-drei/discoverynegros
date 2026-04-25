import { useEffect, useState } from 'react';

export default function useDestinations(fetcher) {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!fetcher) {
        return;
      }

      try {
        setIsLoading(true);
        const result = await fetcher();
        if (isMounted) {
          setDestinations(result || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return { destinations, isLoading, error };
}
