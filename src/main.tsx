import bridge from '@vkontakte/vk-bridge';

// Инициализация VK Bridge как можно раньше
try {
  bridge.send('VKWebAppInit');
} catch (e) {
  console.error('VK Bridge Init Error:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './AuthContext.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}
