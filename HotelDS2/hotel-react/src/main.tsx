import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // ahora importas el enrutador principal

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
