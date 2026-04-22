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
  
  console.log("[Service Gemini] Préparation de la requête...");
  console.log("[Service Gemini] Payload envoyé:", { clientData, nbAnswers: Object.keys(answers).length });

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientData, answers })
  });

  console.log(`[Service Gemini] Réponse brute du serveur HTTP status: ${response.status}`);

  if (!response.ok) {
    console.error("[Service Gemini] Erreur réseau ou 500+", response.status);
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Erreur serveur lors de l'analyse");
  }

  const result = await response.json();
  console.log("[Service Gemini] Données JSON correctement récupérées depuis le serveur !");
  return result;
};
