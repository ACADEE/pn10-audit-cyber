import React from 'react';
import { ClientData } from '../types';

interface Props {
  data: ClientData;
  onChange: (data: ClientData) => void;
  onNext: () => void;
}

export const IdentificationForm: React.FC<Props> = ({ data, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto my-10 relative z-10">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800">Nouveau Diagnostic</h2>
        <p className="text-sm text-slate-500 mt-1">Saisissez les informations de l'entreprise pour commencer la session.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
          <input
            required
            type="text"
            name="entreprise"
            value={data.entreprise}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            placeholder="Ex: Acme Corp"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Secteur d'activité</label>
           <input
             required
             type="text"
             name="secteur"
             value={data.secteur}
             onChange={handleChange}
             className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
             placeholder="Ex: Industrie, Services, Commerce..."
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Effectif</label>
          <select
            required
            name="effectif"
            value={data.effectif}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          >
            <option value="" disabled>Sélectionner une tranche</option>
            <option value="1-5">1 à 5 employés</option>
            <option value="6-20">6 à 20 employés</option>
            <option value="21-50">21 à 50 employés</option>
            <option value="51-250">51 à 250 employés</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
                required
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Ex: contact@entreprise.com"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
            <input
                required
                type="tel"
                name="telephone"
                value={data.telephone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Ex: 01 23 45 67 89"
            />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date du diagnostic</label>
            <input
                required
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Votre Nom</label>
            <input
                required
                type="text"
                name="consultant"
                value={data.consultant}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Ex: Jean Dupont"
            />
            </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
          >
            Démarrer l'audit
          </button>
        </div>
      </div>
    </form>
  );
};
