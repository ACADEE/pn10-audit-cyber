export interface ClientData {
  entreprise: string;
  secteur: string;
  effectif: string;
  date: string;
  consultant: string;
  email: string;
  telephone: string;
}

export type AnswerOption = 'oui' | 'non' | 'partiel' | 'ne_sait_pas' | '';

export interface Answer {
  questionId: string;
  reponse: AnswerOption;
  precision: string;
}

export interface Question {
  id: string;
  text: string;
}

export interface Theme {
  id: string;
  title: string;
  questions: Question[];
}

export interface ReportData {
  couverture: {
    scoreGlobal: number;
    niveauRisque: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
    criteresConformes: number;
    totalCriteres: number;
  };
  synthese: {
    scorecard: {
      scoreGlobal: number;
      criteresConformes: number;
      nonConformites: number;
      incidentsAveres: number;
    };
    constatsMajeurs: string[];
    pointsPositifs: string[];
    recommandationPrioritaire: string;
  };
  scoresDomaines: {
    theme: string;
    scoreBrut: number;
    scorePct: number;
    statut: 'CONFORME' | 'INSUFFISANT' | 'CRITIQUE';
    niveauRisque: 'FAIBLE' | 'MODÉRÉ' | 'ÉLEVÉ' | 'CRITIQUE';
  }[];
  resultatsDetailles: {
    theme: string;
    score: string;
    criteres: {
      intitule: string;
      reponse: 'Oui' | 'Non' | 'Partiel';
      precision?: string;
      niveauRisque: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
    }[];
    incidentAvere?: string;
    analyse: string;
  }[];
  matriceRisques: {
    scenarios: {
      nom: string;
      probabilite: 'Rare' | 'Probable' | 'Certain';
      impact: 'Faible' | 'Modéré' | 'Critique';
      niveau: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
      vecteur: string;
    }[];
    synthese: string;
  };
  planAction: {
    urgence: ActionPlan[];
    consolidation: ActionPlan[];
    maturite: ActionPlan[];
    budgetRefcap: BudgetLigne[];
  };
  glossaireRessources: {
    glossaire: { terme: string; definition: string }[];
    ressources: { ressource: string; url: string; usage: string }[];
  };
}

export interface ActionPlan {
  titre: string;
  priorite: 'IMMÉDIAT' | 'COURT TERME' | 'MOYEN TERME';
  responsable: string;
  delai: string;
  actionsConcretes: string[];
  cout: string;
  impact: string;
}

export interface BudgetLigne {
  poste: string;
  cout: string;
  horizon: string;
  priorite: string;
  totalPhase: string;
}
