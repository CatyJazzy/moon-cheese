import { RouterProvider } from 'react-router';
import router from './router';
import { CurrencyProvider } from './context/currencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalProvider from './providers/GlobalProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;
