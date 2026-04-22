import React from 'react';
import { ClientData, Answer } from '../types';
import { THEMES } from '../data/questions';

interface Props {
  clientData: ClientData;
  answers: Record<string, Answer>;
  onBack: () => void;
  onSubmit: () => void;
}

export const Summary: React.FC<Props> = ({ clientData, answers, onBack, onSubmit }) => {
  const labels: Record<string, string> = {
    'oui': 'Oui',
    'non': 'Non',
    'partiel': 'Partiel',
    'ne_sait_pas': 'Ne sait pas'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Récapitulatif avant analyse</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Entreprise</p>
            <p className="text-sm font-semibold text-slate-800">{clientData.entreprise}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Secteur</p>
            <p className="text-sm font-semibold text-slate-800">{clientData.secteur}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Effectif</p>
            <p className="text-sm font-semibold text-slate-800">{clientData.effectif} employés</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Consultant & Date</p>
            <p className="text-sm font-semibold text-slate-800">{clientData.consultant} - {new Date(clientData.date).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div className="space-y-8">
          {THEMES.map(theme => {
            return (
              <div key={theme.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{theme.title}</h3>
                <ul className="space-y-4">
                  {theme.questions.map(q => {
                    const ans = answers[q.id];
                    return (
                      <li key={q.id} className="text-[13px]">
                        <div className="font-medium text-slate-700">{q.text}</div>
                        <div className="mt-2 flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${
                             ans?.reponse === 'oui' ? 'bg-blue-600 text-white' :
                             ans?.reponse === 'non' ? 'bg-red-50 text-red-700 border border-red-200' :
                             ans?.reponse === 'partiel' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                             'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {ans?.reponse ? labels[ans.reponse] : 'Non répondu'}
                          </span>
                          {ans?.precision && (
                            <span className="text-slate-500 italic">« {ans.precision} »</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 flex items-center justify-between">
           <button
              type="button"
              className="px-6 py-3 rounded-xl text-slate-500 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
              onClick={onBack}
           >
              Retour à l'édition
           </button>
           <button
              type="button"
              className="px-8 py-3 rounded-xl bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
              onClick={onSubmit}
           >
              Lancer l'analyse IA
           </button>
        </div>
      </div>
    </div>
  );
};
