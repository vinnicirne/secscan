import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Garante que o process.cwd() funcione
  const cwd = process.cwd ? process.cwd() : '.';
  
  // Carrega variáveis de arquivos .env locais
  const env = loadEnv(mode, cwd, '');
  
  // LÓGICA DE CAPTURA DA CHAVE (Prioridade Máxima)
  // 1. process.env.API_KEY: Variável de sistema da Vercel (inserida no painel Settings)
  // 2. process.env.VITE_API_KEY: Variável de sistema da Vercel com prefixo
  // 3. env.API_KEY: Arquivo .env local
  // 4. env.VITE_API_KEY: Arquivo .env local com prefixo
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY || env.API_KEY || env.VITE_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ AVISO CRÍTICO DE BUILD: Nenhuma API_KEY encontrada nas variáveis de ambiente!");
  } else {
    // Mascara a chave no log para segurança, mostrando apenas os últimos 4 dígitos
    const maskedKey = apiKey.length > 4 ? `...${apiKey.slice(-4)}` : '***';
    console.log(`✅ SUCESSO DE BUILD: API_KEY encontrada (${maskedKey}) e será injetada.`);
  }

  return {
    plugins: [react()],
    define: {
      // Injeta a chave para ser acessada via process.env.API_KEY (compatibilidade node)
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Injeta a chave para ser acessada via import.meta.env.VITE_API_KEY (padrão Vite)
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
    },
  };
});