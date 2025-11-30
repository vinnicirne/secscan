
import React, { useEffect } from 'react';
import { CONFIG } from '../config';

interface AdSpaceProps {
  slotId?: string; // O ID do slot gerado no painel do AdSense (data-ad-slot)
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  slotId,
  format = "auto", 
  className = "",
  label = "Publicidade"
}) => {
  
  useEffect(() => {
    // Tenta inicializar o anúncio se o script do AdSense estiver carregado
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Falha silenciosa se o AdBlocker estiver ativo ou script não carregado
    }
  }, []);

  // Se nenhum slotId for passado, usa um padrão ou não renderiza nada em produção
  // Para este template, usaremos o placeholder se não houver slot definido
  const currentSlotId = slotId || "1234567890";

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      {/* Label discreta para indicar publicidade (Requiremento de UX/Google) */}
      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 select-none">
        {label}
      </span>
      
      {/* Container do Anúncio */}
      <div className="w-full bg-slate-100 border border-slate-200 rounded-lg overflow-hidden min-h-[100px] flex items-center justify-center relative">
        
        {/* Placeholder Visual (Apenas aparece se o anúncio não carregar ou em dev) */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-medium pointer-events-none bg-slate-50/50">
          Espaço Publicitário ({currentSlotId})
        </div>

        {/* Código real do AdSense */}
        <ins className="adsbygoogle w-full block"
             style={{ display: 'block' }}
             data-ad-client={CONFIG.adsense.publisherId}
             data-ad-slot={currentSlotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

export default AdSpace;
