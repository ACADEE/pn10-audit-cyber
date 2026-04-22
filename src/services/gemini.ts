import { ClientData, AnswerOption, ReportData } from '../types';

export const checkGeminiConnection = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/check');
    if (!res.ok) return false;
    const data = await res.json();
    return data.ok === true;
  } catch (e) {
    console.error("Gemini connection check failed:", e);
    return false;
  }
};

export const analyzeDiagnostic = async (
  clientData: ClientData,
  answers: Record<string, { reponse: AnswerOption; precision: string }>
): Promise<ReportData> => {
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientData, answers })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Erreur serveur lors de l'analyse");
  }

  return response.json();
};
