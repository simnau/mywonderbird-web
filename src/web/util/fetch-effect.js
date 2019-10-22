import { useEffect, useState } from 'react';

import { get } from './fetch';

export default function useFetch(url, defaultData) {
  const [data, updateData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [runCount, setRunCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await get(url);
      updateData(result.data);
      setIsLoading(false);
    };
    fetchData();
    return () => {};
  }, [url, runCount]);

  return { data, isLoading, rerun: () => setRunCount(runCount + 1) };
}
