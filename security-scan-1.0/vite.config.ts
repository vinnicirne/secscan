import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (ex: .env.local, ou variáveis da Vercel)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso substitui 'process.env.API_KEY' no seu código pelo valor real da variável
      // durante o processo de build da Vercel.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});