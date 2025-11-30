import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Garante que o process.cwd() funcione em qualquer ambiente
  const cwd = (process as any).cwd ? (process as any).cwd() : '.';
  
  // Carrega variáveis de arquivos .env locais
  const env = loadEnv(mode, cwd, '');
  
  // LÓGICA DE CAPTURA DA CHAVE (Prioridade Máxima)
  // Busca por VITE_API_KEY (padrão) ou API_KEY (fallback)
  // Checa tanto no process.env (Sistema/Vercel) quanto no env carregado do arquivo (Local)
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || env.VITE_API_KEY || env.API_KEY;

  if (!apiKey) {
    console.warn("⚠️ AVISO DE BUILD: Nenhuma chave de API detectada. O app pode falhar em produção.");
  } else {
    // Mascara a chave no log para segurança
    const maskedKey = apiKey.length > 4 ? `...${apiKey.slice(-4)}` : '***';
    console.log(`✅ BUILD: Chave de API injetada com sucesso (${maskedKey})`);
  }

  return {
    plugins: [react()],
    define: {
      // Força a definição da variável global para o cliente
      // Isso garante que import.meta.env.VITE_API_KEY sempre tenha valor se a chave for encontrada
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      // Fallback para compatibilidade
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});