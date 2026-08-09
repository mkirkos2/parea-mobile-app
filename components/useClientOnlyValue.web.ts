import { useEffect, useState } from 'react';

// `useEffect` is not invoked during server rendering, meaning
// we can use this to determine if we're on the server or not.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const [value, setValue] = useState<S | C>(server);
  
  useEffect(() => {
    // Use requestAnimationFrame to defer the state update
    const frame = requestAnimationFrame(() => {
      setValue(client);
    });
    
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [client]);

  return value;
}
