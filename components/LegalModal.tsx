
import React from 'react';
import { X, ShieldCheck, FileText, Lock, Mail } from 'lucide-react';
import { CONFIG } from '../config';

export type LegalPageType = 'ABOUT' | 'TERMS' | 'PRIVACY' | 'CONTACT';

interface LegalModalProps {
  isOpen: boolean;
  type: LegalPageType | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'ABOUT':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                 <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sobre o {CONFIG.siteName}</h2>
            </div>
            
            <p>
              Bem-vindo ao <strong>{CONFIG.siteName}</strong>, sua ferramenta confiável para análise preliminar de segurança web e otimização para motores de busca (SEO).
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">Nossa Missão</h3>
            <p>
              Em um ambiente digital cada vez mais complexo, a segurança e a visibilidade não devem ser privilégios de grandes corporações. Nossa missão é democratizar o acesso a diagnósticos técnicos de alta qualidade. Utilizamos inteligência artificial avançada para ajudar desenvolvedores, webmasters e proprietários de pequenas empresas a identificarem falhas críticas antes que elas se tornem problemas reais.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">Como Funciona</h3>
            <p>
              O {CONFIG.siteName} opera realizando uma leitura não invasiva do código-fonte público da URL fornecida. Nossos algoritmos, alimentados pela tecnologia Google Gemini, analisam:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Vulnerabilidades de Front-end:</strong> Exposição de chaves de API, scripts inseguros e configurações de cabeçalho.</li>
              <li><strong>SEO Técnico:</strong> Estrutura de tags, meta-dados, acessibilidade e boas práticas de indexação.</li>
              <li><strong>Conformidade:</strong> Verificação básica de requisitos legais e de privacidade.</li>
            </ul>

            <h3 className="font-bold text-lg text-slate-800 mt-4">Compromisso com a Comunidade</h3>
            <p>
              Esta ferramenta é gratuita e projetada para fins educacionais e de monitoramento preventivo. Acreditamos que uma web mais segura é construída através do conhecimento compartilhado e ferramentas acessíveis.
            </p>
          </div>
        );

      case 'TERMS':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-100 rounded-lg">
                 <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Termos de Uso</h2>
            </div>

            <p className="text-sm text-slate-500">Última atualização: {new Date().toLocaleDateString()}</p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">1. Aceitação dos Termos</h3>
            <p>
              Ao acessar e usar o {CONFIG.siteName}, você aceita e concorda em estar vinculado aos termos e disposições deste acordo. Além disso, ao usar os serviços particulares deste site, você deve estar sujeito a quaisquer regras ou diretrizes publicadas aplicáveis a esses serviços.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">2. Uso Responsável</h3>
            <p>
              Você concorda em usar esta ferramenta <strong>apenas para fins legais e éticos</strong>. Você deve ter autorização explícita para escanear qualquer site que não seja de sua propriedade. O uso desta ferramenta para reconhecimento prévio a ataques cibernéticos, engenharia reversa maliciosa ou qualquer atividade ilegal é estritamente proibido.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">3. Isenção de Responsabilidade (Disclaimer)</h3>
            <p className="bg-slate-50 p-4 border-l-4 border-slate-300 italic">
              O {CONFIG.siteName} e seus componentes são fornecidos "como estão", sem qualquer tipo de garantia, expressa ou implícita. Não garantimos que a análise detectará todas as vulnerabilidades existentes. Um resultado "Seguro" ou "Score 100" não garante que o site é imune a ataques. Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar esta ferramenta.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">4. Precisão dos Dados</h3>
            <p>
              Os relatórios gerados utilizam Inteligência Artificial e podem conter imprecisões, falsos positivos ou "alucinações" técnicas. Os resultados devem ser validados manualmente por um profissional de segurança qualificado antes de qualquer implementação crítica.
            </p>
            
            <h3 className="font-bold text-lg text-slate-800 mt-4">5. Propriedade Intelectual</h3>
            <p>
              Todo o conteúdo deste site, incluindo logotipos, design visual e código, é propriedade intelectual do {CONFIG.siteName}, exceto quando indicado o contrário.
            </p>
          </div>
        );

      case 'PRIVACY':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                 <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Política de Privacidade</h2>
            </div>

            <p className="text-sm text-slate-500">Esta política descreve como o {CONFIG.siteName} coleta, usa e protege suas informações.</p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">1. Coleta e Uso de Dados</h3>
            <p>
              <strong>URLs Analisadas:</strong> As URLs que você insere na ferramenta são processadas em tempo real para gerar o relatório. Não armazenamos permanentemente o conteúdo dos sites analisados em nossos bancos de dados. O histórico de scans exibido na interface é armazenado localmente no seu dispositivo (Local Storage) e não é acessível por nós.
            </p>
            <p>
              <strong>Dados de API:</strong> Para realizar a análise inteligente, o conteúdo HTML extraído da URL pública pode ser enviado para a API do Google Gemini. Este processamento é transacional e não é usado para treinar modelos com seus dados privados.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">2. Cookies e Web Beacons</h3>
            <p>
              Utilizamos cookies para armazenar informações, como as suas preferências pessoais quando visita o nosso site. Isso pode incluir um simples popup, ou uma ligação em vários serviços que providenciamos.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">3. Cookie DoubleClick Dart (Google AdSense)</h3>
            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm">
                <p>
                  O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso site. Com o cookie DART, o Google pode exibir anúncios para seus usuários com base nas visitas feitas ao nosso site e a outros sites na Internet.
                </p>
                <p className="mt-2">
                  Os usuários podem desativar o uso do cookie DART visitando a Política de privacidade da rede de conteúdo e dos anúncios do Google no seguinte URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow" className="text-blue-600 hover:underline">https://policies.google.com/technologies/ads</a>
                </p>
            </div>

            <h3 className="font-bold text-lg text-slate-800 mt-4">4. Log Files</h3>
            <p>
              Como a maioria dos outros sites, coletamos e utilizamos informação contida nos registos. A informação nos registos inclui o seu endereço IP (Internet Protocol), o seu ISP (Internet Service Provider), o browser que utilizou ao visitar o nosso site (como o Chrome ou Firefox), o tempo da sua visita e que páginas visitou dentro do nosso site.
            </p>

            <h3 className="font-bold text-lg text-slate-800 mt-4">5. Seus Direitos</h3>
            <p>
              Você tem o direito de desativar os cookies nas opções do seu browser, ou efetuando alterações nas ferramentas de programas Antivírus. No entanto, isso poderá alterar a forma como interage com o nosso site ou outros sites.
            </p>
          </div>
        );

      case 'CONTACT':
        return (
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-lg">
                 <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Entre em Contato</h2>
            </div>

            <p className="text-lg text-slate-700">
              Valorizamos seu feedback. Se você tiver dúvidas sobre nossa ferramenta, sugestões de melhorias ou preocupações relacionadas à privacidade, por favor, não hesite em nos contatar.
            </p>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mt-6 text-center space-y-4">
              <p className="font-medium text-slate-900">Canal Oficial de Suporte</p>
              
              <a href={`mailto:${CONFIG.contactEmail}`} className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <Mail className="w-6 h-6" />
                {CONFIG.contactEmail}
              </a>
              
              <p className="text-sm text-slate-500 max-w-md mx-auto pt-4 border-t border-slate-100">
                Geralmente respondemos em até 24 horas úteis. Para reportar bugs críticos, por favor inclua "BUG CRÍTICO" no assunto do e-mail.
              </p>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg text-sm text-blue-800">
              <strong>Nota:</strong> Não oferecemos consultoria de segurança personalizada via e-mail. Esta ferramenta é fornecida para autoatendimento.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Documentação Legal
          </span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 overflow-y-auto text-slate-600 leading-relaxed text-base">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {CONFIG.siteName} &copy; {new Date().getFullYear()}
          </span>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
