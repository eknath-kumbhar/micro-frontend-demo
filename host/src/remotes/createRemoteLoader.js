import React, { Suspense } from 'react';
import RemoteErrorBoundary from '../components/RemoteErrorBoundary';

function createRemoteLoader(name, importFn, retries = 2) {
  const loadRemote = async (attempt = 0) => {
    try {
      const module = await importFn();
      return { default: module.default || module };
    } catch (error) {
      if (attempt < retries) {
        console.warn(
          `[Host] Retrying remote load for ${name} (${attempt + 1}/${retries + 1})`
        );
        return loadRemote(attempt + 1);
      }

      console.error(`[Host] Failed to load remote: ${name}`, error);
      throw error;
    }
  };

  const LazyComponent = React.lazy(() => loadRemote());

  return function RemoteWrapper(props) {
    return (
      <RemoteErrorBoundary name={name}>
        <Suspense fallback={<div className="loading">Loading {name}...</div>}>
          <LazyComponent {...props} />
        </Suspense>
      </RemoteErrorBoundary>
    );
  };
}

export default createRemoteLoader;
