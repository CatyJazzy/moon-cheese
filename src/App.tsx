import { RouterProvider } from 'react-router';
import router from './router';
import GlobalProvider from './providers/GlobalProvider';

function App() {
  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
}

export default App;
