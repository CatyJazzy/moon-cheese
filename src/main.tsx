import App from '@/App.tsx';
import { enableMocking } from '@/server/brower.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

enableMocking({
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
  onUnhandledRequest: 'bypass',
}).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
});
