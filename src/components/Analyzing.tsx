import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const Analyzing: React.FC = () => {
  const [step, setStep] = useState(0);

  const strings = [
    "Initialisation de l'analyse...",
    "Analyse de la gouvernance et de l'organisation...",
    "Vérification des politiques d'accès et d'identités...",
    "Évaluation de la protection réseau...",
    "Calcul des scores de maturité...",
    "Élaboration du plan de remédiation...",
    "Génération du rapport final..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => Math.min(s + 1, strings.length - 1));
    }, 2000);
    return () => clearInterval(timer);
  }, [strings.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-lg mx-auto text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-blue-500/10">
        <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyse IA en cours</h2>
      <p className="text-slate-500 mb-8 min-h-[3rem] transition-all">
        {strings[step]}
      </p>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden relative">
        <div 
          className="bg-blue-600 h-1.5 rounded-full absolute left-0 top-0 transition-all duration-1000 ease-in-out"
          style={{ width: `${Math.max(10, (step / (strings.length - 1)) * 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 font-mono">
        Analyse propulsée par Gemini 3.1 Pro
      </p>
    </div>
  );
};
