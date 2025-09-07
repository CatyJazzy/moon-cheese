import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, type ReactNode } from 'react';
import Loading from './Loading';
import ErrorSection from './ErrorSection';

interface DataWrapperProps {
  children: ReactNode;
  loadingGuide?: string;
  onRetry?: () => void;
}

function DataWrapper({ children, loadingGuide = '로딩 중...', onRetry }: DataWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorSection
            onRetry={() => {
              if (onRetry) onRetry();
              resetErrorBoundary();
            }}
          />
        )}
      >
        <Suspense fallback={<Loading guide={loadingGuide} />}>{children}</Suspense>
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}

export default DataWrapper;
