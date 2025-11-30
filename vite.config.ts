import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de arquivos .env locais (caso esteja rodando localmente)
  // O terceiro parâmetro '' permite carregar variáveis sem o prefixo VITE_
  const env = loadEnv(mode, process.cwd(), '');
  
  // Tenta pegar a chave de API de várias fontes:
  // 1. process.env.API_KEY: Variável de ambiente do sistema (Vercel)
  // 2. env.API_KEY: Arquivo .env local
  const apiKey = process.env.API_KEY || env.API_KEY;

  // Log de build para verificar se a chave foi encontrada (visível nos logs da Vercel)
  if (!apiKey) {
    console.warn("⚠️ AVISO DE BUILD: API_KEY não encontrada nas variáveis de ambiente!");
  } else {
    console.log("✅ SUCESSO DE BUILD: API_KEY encontrada e será injetada.");
  }

  return {
    plugins: [react()],
    define: {
      // Injeta a chave no código do cliente substituindo 'process.env.API_KEY' pelo valor real
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});