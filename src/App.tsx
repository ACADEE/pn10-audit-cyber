import React, { useState, useEffect } from 'react';
import { ClientData, Answer, ReportData } from './types';
import { IdentificationForm } from './components/IdentificationForm';
import { DiagnosticForm } from './components/DiagnosticForm';
import { Summary } from './components/Summary';
import { Analyzing } from './components/Analyzing';
import { ReportDashboard } from './components/ReportDashboard';
import { LandingPage } from './components/LandingPage';
import { analyzeDiagnostic, checkGeminiConnection } from './services/gemini';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type Step = 'landing' | 'identification' | 'diagnostic' | 'summary' | 'analyzing' | 'report';

function App() {
  const [step, setStep] = useState<Step>('landing');
  const [geminiStatus, setGeminiStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [clientData, setClientData] = useState<ClientData>({
    entreprise: '',
    secteur: '',
    effectif: '',
    date: new Date().toISOString().split('T')[0],
    consultant: '',
    email: '',
    telephone: ''
  });

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    if (step !== 'landing' && geminiStatus === 'checking') {
      checkGeminiConnection().then((isOk) => {
        setGeminiStatus(isOk ? 'ok' : 'error');
      });
    }
  }, [step, geminiStatus]);

  const handleUpdateAnswer = (answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }));
  };

  const handleGoToSummary = () => {
    setStep('summary');
    console.log("[Etape] Navigation vers le Récapitulatif avant analyse");
    console.log("[Etape] Déclenchement du Webhook Make.com...");
    
    // Webhook Make.com non-bloquant (lancé à l'affichage du récapitulatif)
    fetch('https://hook.eu1.make.com/edmr3sl14oxf6776rufg4t9b5y8u48mr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientData, answers })
    })
    .then(res => console.log("[Webhook] Configuration envoyée, status HTTP:", res.status))
    .catch(e => console.error("[Webhook] Erreur d'envoi webhook:", e));
  };

  const handleStartAnalysis = async () => {
    setStep('analyzing');
    console.log("[Etape] Démarrage de l'analyse IA (App.tsx)...");

    try {
      const data = await analyzeDiagnostic(clientData, answers);
      console.log("[Etape] Rapport généré avec succès. Passage au Dashboard.");
      setReportData(data);
      setStep('report');
    } catch (error: any) {
      console.error("[Analyse - ERREUR GLOBALE]", error);
      alert(`Une erreur est survenue lors de l'analyse IA: ${error.message}`);
      setStep('summary'); // go back on error
    }
  };

  const handleRestart = () => {
    setStep('identification');
    setClientData({
      entreprise: '',
      secteur: '',
      effectif: '',
      date: new Date().toISOString().split('T')[0],
      consultant: '',
      email: '',
      telephone: ''
    });
    setAnswers({});
    setReportData(null);
  };

  if (step === 'landing') {
    return <LandingPage onStartAudit={() => setStep('identification')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      <div className="bg-red-600 text-white text-center text-xs sm:text-sm py-2 font-medium px-4 shadow-sm z-20 relative">
        🔒 Pour des raisons de sécurité et de confidentialité, aucune de vos données saisies n'est sauvegardée sur nos serveurs.
      </div>
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-end shrink-0 z-10 shadow-sm relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-700"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-900 uppercase">Audit Cyber • MVP v1.0</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            {clientData.entreprise || "Nouvel Audit"} <span className="text-slate-400 mx-2 font-light">/</span> Diagnostic de Sécurité
          </h1>
        </div>
        <div className="flex items-end gap-8">
          {clientData.consultant && (
            <div className="text-right flex flex-col gap-1 hidden sm:flex">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Consultant</p>
              <p className="text-sm font-semibold text-slate-700">{clientData.consultant}</p>
              <p className="text-[10px] text-slate-400 uppercase">
                {new Date(clientData.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
          {step !== 'identification' && step !== 'report' && (
            <button 
              onClick={handleRestart}
              className="text-sm font-medium text-slate-400 hover:text-slate-800 transition pb-1"
            >
              Annuler
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden w-full relative">
        <div className="flex-1 overflow-y-auto flex flex-col h-full">
          {step === 'identification' && (
            <div className="p-8 w-full">
              <IdentificationForm 
                data={clientData} 
                onChange={setClientData} 
                onNext={() => setStep('diagnostic')} 
              />
            </div>
          )}
          
          {step === 'diagnostic' && (
            <DiagnosticForm 
              answers={answers} 
              onUpdateAnswer={handleUpdateAnswer}
              onComplete={handleGoToSummary}
            />
          )}
          
          {step === 'summary' && (
            <div className="p-8 w-full">
              <Summary 
                clientData={clientData}
                answers={answers}
                onBack={() => setStep('diagnostic')}
                onSubmit={handleStartAnalysis}
              />
            </div>
          )}
          
          {step === 'analyzing' && (
            <div className="p-8 h-full w-full">
              <Analyzing />
            </div>
          )}
          
          {step === 'report' && reportData && (
            <div className="p-8 w-full">
              <ReportDashboard 
                data={reportData}
                client={clientData}
                onRestart={handleRestart}
              />
            </div>
          )}
        </div>
      </main>

      {/* App Footer */}
      {step !== 'report' && (
        <footer className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shrink-0 z-10 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Audit de sécurité locale • API Gemini 3.1 Pro</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>Statut Gemini API :</span>
            {geminiStatus === 'checking' && (
              <span className="flex items-center gap-1.5 text-slate-500"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Vérification...</span>
            )}
            {geminiStatus === 'ok' && (
              <span className="flex items-center gap-1.5 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> Connecté</span>
            )}
            {geminiStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-red-600" title="Échec de la connexion à l'API Gemini. Veuillez vérifier votre clé API."><AlertCircle className="w-3.5 h-3.5" /> Erreur de connexion</span>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
