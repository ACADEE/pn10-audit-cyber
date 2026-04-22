import React, { useState } from 'react';
import { THEMES } from '../data/questions';
import { AnswerOption, Answer } from '../types';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  answers: Record<string, Answer>;
  onUpdateAnswer: (answer: Answer) => void;
  onComplete: () => void;
}

export const DiagnosticForm: React.FC<Props> = ({ answers, onUpdateAnswer, onComplete }) => {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const activeTheme = THEMES[activeThemeIndex];

  const totalQuestions = THEMES.reduce((acc, theme) => acc + theme.questions.length, 0);
  const answeredQuestionsCount = Object.keys(answers).length;
  const progress = Math.round((answeredQuestionsCount / totalQuestions) * 100);

  const isThemeComplete = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return false;
    return theme.questions.every(q => answers[q.id]?.reponse);
  };

  const handleNext = () => {
    if (activeThemeIndex < THEMES.length - 1) {
      setActiveThemeIndex(activeThemeIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex-1 flex w-full h-full min-h-0">
      {/* Sidebar / Tabs */}
      <aside className="w-full md:w-[280px] bg-white border-r border-slate-200 flex flex-col p-6 space-y-4 shrink-0 overflow-y-auto">
        <div className="pb-4 border-b border-slate-100">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">Progression</p>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[11px] mt-2 font-medium text-slate-500">{activeThemeIndex + 1} thèmes démarrés sur {THEMES.length}</p>
        </div>

        <nav className="flex flex-col gap-2 pt-2">
          {THEMES.map((theme, index) => {
            const complete = isThemeComplete(theme.id);
            const active = index === activeThemeIndex;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveThemeIndex(index)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all ${
                  active 
                    ? 'font-semibold bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : complete
                      ? 'font-medium bg-green-50 text-green-700'
                      : 'font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <span>{(index + 1).toString().padStart(2, '0')}</span> 
                <span className="line-clamp-1">{theme.title}</span>
                {complete && !active && (
                  <span className="ml-auto text-green-600 font-bold italic">✓</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <section className="flex-1 p-6 md:p-10 bg-slate-50 flex flex-col min-w-0 h-full">
        <div className="mb-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Thème {activeThemeIndex + 1} : {activeTheme.title}</h2>
          <p className="text-sm text-slate-500 mt-1">Veuillez sélectionner une réponse pour chaque question.</p>
        </div>
        
        <div className="space-y-6 overflow-y-auto pr-4 pb-12 flex-1 relative">
          {activeTheme.questions.map((q, idx) => {
            const currentAnswer = answers[q.id]?.reponse || '';
            const currentPrecision = answers[q.id]?.precision || '';

            return (
              <div key={q.id} className={`bg-white p-5 rounded-2xl shadow-sm space-y-4 ${
                currentAnswer ? 'border border-blue-200 ring-2 ring-blue-500/10' : 'border border-slate-200'
              }`}>
                <p className="text-[15px] font-medium leading-relaxed text-slate-700">
                  {q.text}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {(['oui', 'non', 'partiel', 'ne_sait_pas'] as AnswerOption[]).map(option => {
                    const labels: Record<string, string> = {
                      'oui': 'Oui',
                      'non': 'Non',
                      'partiel': 'Partiel',
                      'ne_sait_pas': 'Ne sait pas'
                    };
                    
                    let activeStyle = '';
                    if (currentAnswer === option) {
                       if (option === 'oui') activeStyle = 'bg-blue-600 text-white border-blue-600 shadow-sm';
                       else if (option === 'non') activeStyle = 'bg-red-50 border-red-200 text-red-700 font-bold';
                       else if (option === 'partiel') activeStyle = 'bg-orange-50 border-orange-200 text-orange-700 font-bold';
                       else activeStyle = 'bg-slate-100 border-slate-300 text-slate-600 font-bold';
                    }

                    return (
                      <label 
                        key={option}
                        className={`cursor-pointer px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-tight transition-colors ${
                          currentAnswer === option
                            ? activeStyle
                            : 'border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name={q.id}
                          value={option}
                          checked={currentAnswer === option}
                          onChange={() => onUpdateAnswer({ questionId: q.id, reponse: option, precision: currentPrecision })}
                        />
                        {labels[option]}
                      </label>
                    )
                  })}
                </div>

                {currentAnswer && (
                  <div className="mt-4 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                      rows={2}
                      placeholder="Précisions facultatives..."
                      className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={currentPrecision}
                      onChange={(e) => onUpdateAnswer({ questionId: q.id, reponse: currentAnswer, precision: e.target.value })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="mt-auto pt-8 flex justify-between items-center shrink-0">
           <button
              type="button"
              className="px-6 py-3 rounded-xl text-slate-500 text-sm font-bold border border-slate-200 hover:bg-white disabled:opacity-50 transition-colors"
              onClick={() => setActiveThemeIndex(Math.max(0, activeThemeIndex - 1))}
              disabled={activeThemeIndex === 0}
           >
              Précédent
           </button>

           <button
              type="button"
              className="px-8 py-3 rounded-xl bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
              onClick={handleNext}
           >
              {activeThemeIndex < THEMES.length - 1 ? `Suivant : ${THEMES[activeThemeIndex+1].title}` : 'Terminer'}
           </button>
        </footer>
      </section>
    </div>
  );
};
