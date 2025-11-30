
import React, { useState, useEffect } from 'react';
import { Shield, Globe, Play, RefreshCw, AlertCircle, History, Trash2, Clock, CheckSquare, Square } from 'lucide-react';
import { AnalysisResult, AnalysisType, ScanOptions } from './types';
import { analyzeSecurity } from './services/geminiService';
import ResultDashboard from './components/ResultDashboard';
import Footer from './components/Footer';
import LegalModal, { LegalPageType } from './components/LegalModal';
import CookieConsent from './components/CookieConsent';
import LandingContent from './components/LandingContent';
import AdSpace from './components/AdSpace';
import { CONFIG } from './config';
import clsx from 'clsx';

function App() {
  const [inputContent, setInputContent] = useState("https://");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Verificando...");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  
  // Legal Pages State
  const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
  
  // Scan Options State
  const [scanOptions, setScanOptions] = useState<ScanOptions>({
    checkSecurity: true,
    checkSeo: true
  });

  const activeTab = AnalysisType.URL_SCAN;

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('securityScanHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult) => {
    const updatedHistory = [newResult, ...history].slice(0, 5); // Keep last 5
    setHistory(updatedHistory);
    localStorage.setItem('securityScanHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('securityScanHistory');
  };

  const loadFromHistory = (item: AnalysisResult) => {
    setResult(item);
    setInputContent(item.targetUrl || "https://");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOption = (key: keyof ScanOptions) => {
    setScanOptions(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      // Prevent disabling both
      if (!newState.checkSecurity && !newState.checkSeo) {
        return prev;
      }
      return newState;
    });
  };

  const simulateLoadingSteps = () => {
    const steps = ["Iniciando conexão..."];
    if (scanOptions.checkSecurity) {
      steps.push("Analisando Cabeçalhos e Segurança...");
      steps.push("Verificando Endpoints Expostos...");
    }
    if (scanOptions.checkSeo) {
      steps.push("Auditando Meta Tags e Estrutura...");
      steps.push("Calculando pontuação de SEO...");
    }
    steps.push("Gerando Relatório Final...");

    let step = 0;
    setLoadingText(steps[0]);
    
    return setInterval(() => {
      step++;
      if (step < steps.length) {
        setLoadingText(steps[step]);
      }
    }, 1200); 
  };

  const handleAnalyze = async () => {
    if (!inputContent.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    const loadingInterval = simulateLoadingSteps();

    let contentToAnalyze = inputContent;

    if (!inputContent.startsWith('http')) {
      setError("Por favor insira uma URL válida começando com http:// ou https://");
      setIsLoading(false);
      clearInterval(loadingInterval);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(inputContent, { 
        signal: controller.signal,
        headers: { 'Accept': 'text/html' },
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        contentToAnalyze = `Target URL: ${inputContent}\n\nFetched HTML Content (Partial - First 15000 chars):\n${text.slice(0, 15000)}`;
      } else {
         throw new Error(`Status ${response.status}`);
      }
    } catch (e) {
      console.warn("Could not fetch URL content client-side:", e);
      contentToAnalyze = `Target URL: ${inputContent}\n\n(Nota: Não foi possível baixar o HTML da página automaticamente devido a restrições de segurança do navegador (CORS) ou erro de conexão. Por favor, realize a análise baseada na estrutura da URL e domínio).`;
    }

    try {
      const analysis = await analyzeSecurity(contentToAnalyze, activeTab, scanOptions);
      
      const enrichedResult: AnalysisResult = {
        ...analysis,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        targetUrl: inputContent
      };

      setResult(enrichedResult);
      saveToHistory(enrichedResult);
    } catch (err: any) {
      console.error("Erro capturado no App:", err);
      
      if (err.message === "API_KEY_MISSING") {
        setError("Configuração de API Ausente. Verifique se a variável de ambiente 'API_KEY' está configurada na Vercel.");
      } else if (err.message && err.message.includes("429")) {
        setError("Limite de uso da API excedido temporariamente. Tente novamente em alguns minutos.");
      } else {
        setError("Falha ao analisar. Verifique sua conexão ou tente novamente.");
      }
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-2.5 rounded-lg shadow-lg shadow-blue-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{CONFIG.siteName}</h1>
                <p className="text-slate-500 text-sm">Auditoria de Segurança & SEO</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM: ONLINE
            </div>
          </header>

          {/* Top Ad Space */}
          <AdSpace slotId={CONFIG.adsense.slots.topBanner} className="hidden md:flex" />

          {/* Main Content Area */}
          <main className="grid grid-cols-1 gap-8">
            
            {/* Input Section */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
              <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                 <h2 className="text-lg font-semibold text-slate-800">Nova Análise</h2>
                 <p className="text-sm text-slate-500">Insira a URL e selecione os módulos desejados.</p>
              </div>

              {/* Input Form */}
              <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-full max-w-2xl space-y-6">
                    
                    {/* URL Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">URL do Site</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="url" 
                          value={inputContent}
                          onChange={(e) => setInputContent(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                          placeholder="https://seu-site.com.br"
                        />
                      </div>
                    </div>

                    {/* Options Toggles */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => toggleOption('checkSecurity')}
                        className={clsx(
                          "flex-1 flex items-center justify-between p-3 rounded-lg border transition-all",
                          scanOptions.checkSecurity 
                            ? "bg-blue-50 border-blue-200 text-blue-800" 
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Shield className={clsx("w-5 h-5", scanOptions.checkSecurity ? "text-blue-600" : "text-slate-400")} />
                          Módulo Segurança
                        </span>
                        {scanOptions.checkSecurity ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>

                      <button 
                        onClick={() => toggleOption('checkSeo')}
                        className={clsx(
                          "flex-1 flex items-center justify-between p-3 rounded-lg border transition-all",
                          scanOptions.checkSeo 
                            ? "bg-green-50 border-green-200 text-green-800" 
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <RefreshCw className={clsx("w-5 h-5", scanOptions.checkSeo ? "text-green-600" : "text-slate-400")} />
                          Módulo SEO
                        </span>
                        {scanOptions.checkSeo ? <CheckSquare className="w-5 h-5 text-green-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                      <p>A ferramenta fará uma leitura pública do site (CORS-permitting). Se houver bloqueio, a análise será baseada na estrutura da URL e padrões conhecidos.</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center w-full">
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading || !inputContent.trim()}
                      className={clsx(
                        "flex items-center gap-2 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all w-full md:w-auto justify-center",
                        isLoading
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25 active:scale-95"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          {loadingText}
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 fill-current" />
                          Iniciar Scan
                        </>
                      )}
                    </button>
                  </div>
              </div>
            </section>

            {/* History Section - Only visible if there is history and no current result */}
            {history.length > 0 && !result && (
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-slate-600 font-semibold flex items-center gap-2">
                    <History className="w-4 h-4" /> Scans Recentes
                  </h3>
                  <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" /> Limpar Histórico
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={clsx(
                          "text-xs font-bold px-2 py-0.5 rounded border",
                          item.riskLevel === 'SAFE' ? "bg-green-50 text-green-700 border-green-200" :
                          item.riskLevel === 'LOW' ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {item.riskLevel}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-slate-700 truncate mb-1">{item.targetUrl}</p>
                      <div className="flex gap-2 text-xs text-slate-500">
                         <span>Sec: {item.score}</span>
                         <span>SEO: {item.seoScore || 0}</span>
                      </div>
                      <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                        <div 
                          className={clsx("h-full", item.score > 80 ? "bg-green-500" : item.score > 50 ? "bg-yellow-500" : "bg-red-500")} 
                          style={{ width: `${item.score/2}%` }}
                        />
                         <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(item.seoScore || 0)/2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                {error}
              </div>
            )}

            {/* Results Section OR Landing Content */}
            {result ? (
              <ResultDashboard result={result} />
            ) : !isLoading && (
              <LandingContent />
            )}

          </main>
        </div>
      </div>
      
      {/* Bottom Ad Space */}
      <div className="max-w-5xl mx-auto px-8">
         <AdSpace slotId={CONFIG.adsense.slots.bottomBanner} />
      </div>

      {/* Footer added at the bottom */}
      <Footer onOpenPage={setLegalPage} />

      {/* Cookie Consent Banner */}
      <CookieConsent onOpenPrivacy={() => setLegalPage('PRIVACY')} />

      {/* Legal Modal Popups */}
      <LegalModal 
        isOpen={!!legalPage} 
        type={legalPage} 
        onClose={() => setLegalPage(null)} 
      />
    </div>
  );
}

export default App;
