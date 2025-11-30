
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import AnalysisChart from './AnalysisChart';
import SeverityBadge from './SeverityBadge';
import { ShieldCheck, ShieldAlert, FileWarning, AlertTriangle, CheckCircle, Copy, Download, Search, TrendingUp, Lightbulb, LayoutDashboard, Lock, Eye, Check } from 'lucide-react';
import clsx from 'clsx';
import AdSpace from './AdSpace';
import { CONFIG } from '../config';

interface ResultDashboardProps {
  result: AnalysisResult;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SECURITY' | 'SEO'>('OVERVIEW');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Helper to determine if a section was actually run
  const hasSecurityRun = result.score > 0 || result.findings.length > 0;
  const hasSeoRun = (result.seoScore || 0) > 0 || (result.seoFindings?.length || 0) > 0;

  const handleCopy = (text: string, index: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'SAFE': return 'text-green-600 bg-green-50 border-green-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'SAFE': return <ShieldCheck className="w-16 h-16 text-green-500" />;
      case 'CRITICAL': 
      case 'HIGH': return <ShieldAlert className="w-16 h-16 text-red-500" />;
      default: return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `security_seo_report_${result.targetUrl?.replace(/[^a-z0-9]/gi, '_') || 'scan'}_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
              activeTab === 'OVERVIEW' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>
          
          {hasSecurityRun && (
            <button 
              onClick={() => setActiveTab('SECURITY')}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                activeTab === 'SECURITY' ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Lock className="w-4 h-4" /> Segurança
            </button>
          )}

          {hasSeoRun && (
            <button 
              onClick={() => setActiveTab('SEO')}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                activeTab === 'SEO' ? "bg-white text-green-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Search className="w-4 h-4" /> SEO
            </button>
          )}
        </div>

        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Exportar JSON
        </button>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Summary Cards */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasSecurityRun && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full translate-x-10 -translate-y-10" />
                <div className="relative z-10">
                   {getRiskIcon(result.riskLevel)}
                </div>
                <div className="relative z-10">
                  <h3 className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Security Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </span>
                    <span className="text-slate-400 text-sm">/ 100</span>
                  </div>
                  <div className={`mt-2 inline-flex text-xs font-bold px-3 py-1 rounded-full border ${getRiskColor(result.riskLevel)}`}>
                    RISCO: {result.riskLevel}
                  </div>
                </div>
              </div>
            )}

            {hasSeoRun && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-full translate-x-10 -translate-y-10" />
                <div className="relative z-10">
                   <Search className="w-16 h-16 text-green-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-slate-500 text-xs uppercase tracking-wider font-semibold">SEO Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${getScoreColor(result.seoScore || 0)}`}>
                      {result.seoScore || 0}
                    </span>
                    <span className="text-slate-400 text-sm">/ 100</span>
                  </div>
                   <div className="mt-2 inline-flex text-xs font-bold px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">
                    OTIMIZAÇÃO
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Space Mid-Report */}
          <div className="md:col-span-2">
            <AdSpace slotId={CONFIG.adsense.slots.midReport} />
          </div>

          {/* Executive Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:col-span-2 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Resumo da Análise
              </h3>
              {result.timestamp && (
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {result.summary}
            </p>
          </div>

          {/* Mini Chart Preview if Security Ran */}
          {hasSecurityRun && (
             <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 w-full">
                   <h4 className="text-sm font-semibold text-slate-700 mb-2">Vulnerabilidades por Severidade</h4>
                   <AnalysisChart findings={result.findings} />
                </div>
                <div className="w-full md:w-1/3 space-y-2">
                   <div className="text-sm text-slate-600 font-medium">Destaques Rápidos:</div>
                   <ul className="text-xs space-y-1.5 text-slate-500">
                      <li className="flex justify-between"><span>Total de Falhas:</span> <span className="font-mono text-slate-800">{result.findings.length}</span></li>
                      <li className="flex justify-between"><span>Endpoints Expostos:</span> <span className="font-mono text-slate-800">{result.exposedEndpoints.length}</span></li>
                      <li className="flex justify-between"><span>Melhorias SEO:</span> <span className="font-mono text-slate-800">{result.seoFindings?.length || 0}</span></li>
                   </ul>
                </div>
             </div>
          )}
        </div>
      )}

      {/* VIEW: SECURITY */}
      {activeTab === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileWarning className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-slate-800">Detalhamento de Vulnerabilidades</h3>
             </div>

             <div className="space-y-4">
              {result.findings.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-600 font-medium">Nenhuma vulnerabilidade crítica detectada.</p>
                </div>
              ) : (
                result.findings.map((finding, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-blue-300 transition-all shadow-sm">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                      <div>
                        <h4 className="text-slate-800 font-semibold flex items-center gap-2">
                          {finding.title}
                        </h4>
                        {finding.affectedComponent && (
                          <code className="text-xs text-slate-500 mt-1 block font-mono">
                            {finding.affectedComponent}
                          </code>
                        )}
                      </div>
                      <SeverityBadge severity={finding.severity} />
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-slate-600 text-sm">
                        {finding.description}
                      </p>
                      <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-green-600 uppercase">Correção Recomendada</span>
                          {copiedIndex === idx ? (
                            <div className="flex items-center gap-1 text-green-600 animate-in zoom-in duration-200">
                              <span className="text-[10px] font-bold">Copiado</span>
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div 
                              className="flex items-center gap-1 cursor-pointer group/copy"
                              onClick={() => handleCopy(finding.remediation, idx)}
                            >
                              <span className="text-[10px] text-slate-400 group-hover/copy:text-blue-600 transition-colors">Copiar</span>
                              <Copy className="w-3 h-3 text-slate-400 group-hover/copy:text-blue-600 transition-colors" />
                            </div>
                          )}
                        </div>
                        <pre className="text-xs text-slate-700 font-mono overflow-x-auto whitespace-pre-wrap">
                          {finding.remediation}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm sticky top-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Gráfico de Severidade</h3>
              <AnalysisChart findings={result.findings} />
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Endpoints Expostos
                </h3>
                {result.exposedEndpoints.length > 0 ? (
                  <ul className="space-y-2">
                    {result.exposedEndpoints.map((ep, i) => (
                      <li key={i} className="text-xs font-mono text-red-700 bg-red-50 px-2 py-1.5 rounded border border-red-200 flex justify-between items-center break-all">
                        {ep}
                        <Eye className="w-3 h-3 text-red-400" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhum endpoint público suspeito detectado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SEO */}
      {activeTab === 'SEO' && (
        <div className="space-y-6">
           <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800">Relatório de Otimização (SEO)</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {!result.seoFindings || result.seoFindings.length === 0 ? (
                 <div className="col-span-2 p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
                   <p className="text-slate-500">Nenhuma recomendação de SEO específica gerada ou módulo não executado.</p>
                 </div>
               ) : (
                 result.seoFindings.map((seo, idx) => (
                   <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-green-300 transition-all shadow-sm flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className={
                            seo.importance === 'HIGH' ? "w-5 h-5 text-orange-500" :
                            seo.importance === 'MEDIUM' ? "w-5 h-5 text-yellow-500" :
                            "w-5 h-5 text-blue-400"
                          } />
                          <h4 className="font-semibold text-slate-800">{seo.title}</h4>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                             seo.importance === 'HIGH' ? "bg-orange-50 text-orange-700 border-orange-200" :
                             seo.importance === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                             "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {seo.importance}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 flex-grow">{seo.description}</p>
                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <p className="text-xs text-green-700 bg-green-50 border border-green-100 p-2 rounded">
                          <span className="font-semibold block mb-1">Recomendação:</span> 
                          {seo.recommendation}
                        </p>
                      </div>
                   </div>
                 ))
               )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ResultDashboard;
