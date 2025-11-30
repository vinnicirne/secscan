import React from 'react';

interface FooterProps {
  onOpenPage: (page: 'ABOUT' | 'TERMS' | 'PRIVACY' | 'CONTACT') => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPage }) => {
  return (
    <footer className="mt-12 border-t border-slate-200 py-8 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-slate-600 font-medium">
          <button onClick={() => onOpenPage('ABOUT')} className="hover:text-blue-600 transition-colors">
            Sobre Nós
          </button>
          <button onClick={() => onOpenPage('TERMS')} className="hover:text-blue-600 transition-colors">
            Termos de Uso
          </button>
          <button onClick={() => onOpenPage('PRIVACY')} className="hover:text-blue-600 transition-colors">
            Política de Privacidade
          </button>
          <button onClick={() => onOpenPage('CONTACT')} className="hover:text-blue-600 transition-colors">
            Contato
          </button>
        </div>
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Security Scan. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;