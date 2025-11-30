import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('securityScan_cookieConsent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('securityScan_cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl p-6 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700">
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-slate-800 rounded-lg shrink-0">
            <Cookie className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-sm text-slate-300 leading-relaxed">
            <p>
              Utilizamos cookies para melhorar sua experiência, personalizar publicidade e analisar nosso tráfego. 
              Ao continuar navegando, você concorda com a nossa{' '}
              <button 
                onClick={onOpenPrivacy}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium transition-colors"
              >
                Política de Privacidade
              </button>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 whitespace-nowrap"
          >
            Aceitar e Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieConsent;