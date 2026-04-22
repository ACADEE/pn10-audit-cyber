import React, { useState } from 'react';
import { ReportData, ClientData } from '../types';
import { Download, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Info, Calendar, Loader2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { generateWordReport } from '../utils/wordGenerator';

interface Props {
  data: ReportData;
  client: ClientData;
  onRestart: () => void;
}

export const ReportDashboard: React.FC<Props> = ({ data, client, onRestart }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === 'critique') return 'text-red-700 bg-red-100 border-red-300';
    if (r === 'élevé') return 'text-orange-700 bg-orange-100 border-orange-300';
    if (r === 'modéré' || r === 'moyen') return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    if (r === 'faible') return 'text-green-700 bg-green-100 border-green-300';
    return 'text-slate-500 bg-slate-50 border-slate-200';
  };

  const getScoreColor = (score: number) => {
    if (score < 26) return 'text-red-700 bg-red-50 border-red-200';
    if (score <= 50) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (score <= 75) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const downloadWord = async () => {
    setIsGenerating(true);
    setWordError(null);
    try {
      await generateWordReport(client, data);
    } catch (e: any) {
      console.error("Erreur lors de l'export WORD", e);
      setWordError("Erreur de génération WORD.");
    } finally {
      setIsGenerating(false);
    }
  };

  const radarData = data.scoresDomaines?.map(d => ({
    theme: d.theme,
    score: d.scorePct,
    fullMark: 100,
  })) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-slate-800">Rapport de Diagnostic Prêt</h1>
          {wordError && <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded inline-block">{wordError}</span>}
        </div>
        <div className="flex gap-4">
           <button onClick={onRestart} className="px-4 py-2 rounded-lg text-slate-500 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors" disabled={isGenerating}>
             Nouveau diagnostic
           </button>
           <button 
             onClick={downloadWord}
             disabled={isGenerating}
             className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             {isGenerating ? "Génération en cours..." : "Télécharger au format WORD"}
           </button>
        </div>
      </div>

      {/* Rendu visuel condensé du dashboard pour aperçu direct */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 grid gap-8">
        {/* En-tête */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{client.entreprise}</h2>
            <p className="text-slate-500 text-sm mt-1">{client.secteur} — {client.effectif}</p>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(client.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="text-right flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-500 uppercase tracking-widest font-bold">Niveau</span>
              <span className={`px-3 py-1 text-sm font-black mt-1 uppercase border rounded-md ${getRiskColor(data.couverture.niveauRisque)}`}>{data.couverture.niveauRisque}</span>
            </div>
            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(data.couverture.scoreGlobal).replace('bg-', 'border-').replace('text-', 'border-')} shadow-inner`}>
              <span className={`text-2xl font-black ${getScoreColor(data.couverture.scoreGlobal).split(' ')[0]}`}>{data.couverture.scoreGlobal}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Synthèse Scorecard */}
        <div className="grid grid-cols-4 gap-4">
           <div className="bg-slate-50 p-4 border rounded-xl text-center">
             <div className="text-sm text-slate-500 font-bold uppercase mb-1">Score Global</div>
             <div className="text-2xl font-black text-slate-800">{data.synthese.scorecard?.scoreGlobal ?? data.couverture.scoreGlobal}/100</div>
           </div>
           <div className="bg-green-50 border-green-200 p-4 border rounded-xl text-center">
             <div className="text-sm text-green-700 font-bold uppercase mb-1">Conformes</div>
             <div className="text-2xl font-black text-green-800">{data.synthese.scorecard?.criteresConformes ?? data.couverture.criteresConformes}</div>
           </div>
           <div className="bg-orange-50 border-orange-200 p-4 border rounded-xl text-center">
             <div className="text-sm text-orange-700 font-bold uppercase mb-1">Non Conformes</div>
             <div className="text-2xl font-black text-orange-800">{data.synthese.scorecard?.nonConformites ?? (data.couverture.totalCriteres - data.couverture.criteresConformes)}</div>
           </div>
           <div className={`p-4 border rounded-xl text-center ${(data.synthese.scorecard?.incidentsAveres ?? 0) > 0 ? 'bg-red-100 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
             <div className={`text-sm font-bold uppercase mb-1 ${(data.synthese.scorecard?.incidentsAveres ?? 0) > 0 ? 'text-red-700' : 'text-slate-500'}`}>Incidents Avérés</div>
             <div className={`text-2xl font-black ${(data.synthese.scorecard?.incidentsAveres ?? 0) > 0 ? 'text-red-800' : 'text-slate-800'}`}>{data.synthese.scorecard?.incidentsAveres ?? 0}</div>
           </div>
        </div>

        {/* Constats */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
           <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Info className="w-5 h-5"/> Constats Majeurs</h3>
           <ul className="space-y-2 text-sm text-blue-800">
             {data.synthese.constatsMajeurs?.map((c, i) => <li key={i}>• {c}</li>)}
           </ul>
        </div>
        
        {/* Radar */}
        <div>
           <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Couverture par domaine</h3>
           <div className="h-72 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="theme" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#1e40af" fill="#3b82f6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="text-center mt-6 p-4 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
           <p className="text-slate-600 font-medium">L'aperçu en ligne est résumé pour des raisons de lisibilité.</p>
           <p className="text-slate-800 font-bold mt-2">Cliquez sur « Télécharger au format WORD » pour obtenir le rapport complet d'une dizaine de pages, éditable.</p>
        </div>

      </div>
    </div>
  );
};
