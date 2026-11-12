import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root')!;

async function bootstrap() {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await Promise.race([
        Promise.all([
          document.fonts.load('400 16px "Silkscreen"'),
          document.fonts.load('700 16px "Silkscreen"'),
        ]),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } catch {
      // Fallback font stack handles offline or blocked font requests gracefully
    }
  }

  createRoot(rootEl).render(<App />);
}

bootstrap();
