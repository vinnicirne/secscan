
import React from 'react';
import { Shield, Search, Zap, Code, HelpCircle, CheckCircle2 } from 'lucide-react';
import AdSpace from './AdSpace';
import { CONFIG } from '../config';

const LandingContent = () => {
  return (
    <div className="space-y-16 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Features Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Análise Completa para seu Site</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Nossa ferramenta combina verificação de vulnerabilidades de segurança e auditoria de SEO técnico em uma única plataforma gratuita e fácil de usar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Segurança Web</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Detecte configurações inseguras de cabeçalhos HTTP, exposição de chaves de API e endpoints públicos que podem comprometer seus dados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Auditoria SEO</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Verifique meta tags, estrutura de cabeçalhos (H1-H6) e acessibilidade para garantir que seu site seja bem classificado pelo Google.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Correções com IA</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receba diagnósticos precisos e sugestões de código prontas para uso, geradas por inteligência artificial avançada para correção imediata.
            </p>
          </div>
        </div>
      </section>

      {/* AdSpace for Landing Page */}
      <AdSpace slotId={CONFIG.adsense.slots.landingPage} />

      {/* Why it Matters (Text Heavy for AdSense) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Por que analisar seu site regularmente?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Prevenção de Ataques</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Vulnerabilidades simples, como headers ausentes, são vetores comuns para ataques XSS e Clickjacking. Identificá-las cedo economiza tempo e reputação.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Visibilidade Orgânica</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    O Google prioriza sites seguros (HTTPS) e bem estruturados. Corrigir erros técnicos de SEO é a maneira mais rápida de melhorar seu ranking.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Conformidade LGPD</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Garantir que dados de usuários não vazem por endpoints de API mal configurados é essencial para estar em dia com a legislação.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-slate-500" />
              Exemplo de Diagnóstico
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-red-100 text-red-700 p-2 rounded border border-red-200">
                [CRITICAL] API Key exposta no HTML
              </div>
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded border border-yellow-200">
                [MEDIUM] Missing X-Frame-Options Header
              </div>
              <div className="bg-green-100 text-green-700 p-2 rounded border border-green-200">
                [SEO] Meta Description otimizada
              </div>
              <div className="text-slate-400 italic pt-2">
                ...gerando correção automática...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-slate-400" />
          Perguntas Frequentes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2">A ferramenta é realmente gratuita?</h4>
            <p className="text-sm text-slate-600">Sim, o {CONFIG.siteName} é 100% gratuito para uso. Nosso objetivo é tornar a web mais segura e acessível para desenvolvedores e proprietários de sites.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2">Como a análise é feita?</h4>
            <p className="text-sm text-slate-600">Nossa ferramenta acessa o código público (frontend) da URL informada e utiliza modelos de IA para identificar padrões inseguros, configurações erradas e problemas de estrutura sem invadir o servidor.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2">Essa ferramenta substitui um Pentest?</h4>
            <p className="text-sm text-slate-600">Não. O {CONFIG.siteName} é uma ferramenta de análise passiva e diagnóstica. Para auditorias profundas de infraestrutura e backend, recomendamos contratar profissionais especializados.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2">Os dados do meu site ficam salvos?</h4>
            <p className="text-sm text-slate-600">Não armazenamos o código do seu site. O histórico de análises fica salvo apenas no seu navegador (Local Storage) para sua privacidade e conveniência.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingContent;
