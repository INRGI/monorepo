import {DependencyList, useEffect, useRef} from 'react';

function useSkipFirstRender(callback: () => void, dependencies: DependencyList | undefined) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    callback();
  }, dependencies);
}

export default useSkipFirstRender;