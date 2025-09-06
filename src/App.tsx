import { RouterProvider } from 'react-router';
import router from './router';
import { CurrencyProvider } from './context/currencyContext';

function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
    </CurrencyProvider>
  );
}

export default App;
