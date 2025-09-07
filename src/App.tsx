import { RouterProvider } from 'react-router';
import router from './router';
import { CurrencyProvider } from './context/currencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <RouterProvider router={router} />
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;
