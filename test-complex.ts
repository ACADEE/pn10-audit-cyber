import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'referer': 'https://cyberdiag-pn10.netlify.app/'
    }
  }
});

async function run() {
  try {
      const systemInstruction = `Tu es un consultant senior en cybersécurité offensive et défensive. Tu es certifié CISSP, ISO 27001 Lead Auditor...`;

      const payload = { client: {}, reponses: {} };
      const prompt = `Voici les données de l'audit à analyser :\n\n${JSON.stringify(payload, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              couverture: {
                type: Type.OBJECT,
                properties: {
                  scoreGlobal: { type: Type.INTEGER },
                  niveauRisque: { type: Type.STRING, enum: ['CRITIQUE', 'ÉLEVÉ', 'MODÉRÉ', 'FAIBLE'] },
                  criteresConformes: { type: Type.INTEGER },
                  totalCriteres: { type: Type.INTEGER }
                },
                required: ['scoreGlobal', 'niveauRisque', 'criteresConformes', 'totalCriteres']
              },
              synthese: {
                type: Type.OBJECT,
                properties: {
                  scorecard: {
                    type: Type.OBJECT,
                    properties: {
                      scoreGlobal: { type: Type.INTEGER },
                      criteresConformes: { type: Type.INTEGER },
                      nonConformites: { type: Type.INTEGER },
                      incidentsAveres: { type: Type.INTEGER }
                    },
                    required: ['scoreGlobal', 'criteresConformes', 'nonConformites', 'incidentsAveres']
                  },
                  constatsMajeurs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 à 5 points expert" },
                  pointsPositifs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommandationPrioritaire: { type: Type.STRING }
                },
                required: ['scorecard', 'constatsMajeurs', 'pointsPositifs', 'recommandationPrioritaire']
              },
              scoresDomaines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    theme: { type: Type.STRING },
                    scoreBrut: { type: Type.INTEGER },
                    scorePct: { type: Type.INTEGER },
                    statut: { type: Type.STRING, enum: ['CONFORME', 'INSUFFISANT', 'CRITIQUE'] },
                    niveauRisque: { type: Type.STRING, enum: ['FAIBLE', 'MODÉRÉ', 'ÉLEVÉ', 'CRITIQUE'] }
                  },
                  required: ['theme', 'scoreBrut', 'scorePct', 'statut', 'niveauRisque']
                }
              },
              resultatsDetailles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    theme: { type: Type.STRING },
                    score: { type: Type.STRING },
                    criteres: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          intitule: { type: Type.STRING },
                          reponse: { type: Type.STRING, enum: ['Oui', 'Non', 'Partiel'] },
                          precision: { type: Type.STRING },
                          niveauRisque: { type: Type.STRING, enum: ['Faible', 'Modéré', 'Élevé', 'Critique'] }
                        },
                        required: ['intitule', 'reponse', 'niveauRisque']
                      }
                    },
                    incidentAvere: { type: Type.STRING, description: "Optionnel" },
                    analyse: { type: Type.STRING, description: "Analyse experte business 3-5 lignes" }
                  },
                  required: ['theme', 'score', 'criteres', 'analyse']
                }
              },
              matriceRisques: {
                type: Type.OBJECT,
                properties: {
                  scenarios: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nom: { type: Type.STRING },
                        probabilite: { type: Type.STRING, enum: ['Rare', 'Probable', 'Certain'] },
                        impact: { type: Type.STRING, enum: ['Faible', 'Modéré', 'Critique'] },
                        niveau: { type: Type.STRING, enum: ['Faible', 'Modéré', 'Élevé', 'Critique'] },
                        vecteur: { type: Type.STRING }
                      },
                      required: ['nom', 'probabilite', 'impact', 'niveau', 'vecteur']
                    }
                  },
                  synthese: { type: Type.STRING }
                },
                required: ['scenarios', 'synthese']
              },
              planAction: {
                type: Type.OBJECT,
                properties: {
                  urgence: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        titre: { type: Type.STRING },
                        priorite: { type: Type.STRING, enum: ['IMMÉDIAT'] },
                        responsable: { type: Type.STRING },
                        delai: { type: Type.STRING },
                        actionsConcretes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cout: { type: Type.STRING },
                        impact: { type: Type.STRING }
                      },
                      required: ['titre']
                    }
                  }
                },
                required: ['urgence']
              },
              glossaireRessources: {
                type: Type.OBJECT,
                properties: {
                  glossaire: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        terme: { type: Type.STRING },
                        definition: { type: Type.STRING }
                      },
                      required: ['terme', 'definition']
                    }
                  },
                  ressources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        ressource: { type: Type.STRING },
                        url: { type: Type.STRING },
                        usage: { type: Type.STRING }
                      },
                      required: ['ressource', 'url', 'usage']
                    }
                  }
                },
                required: ['glossaire', 'ressources']
              }
            },
            required: [
              'couverture', 'synthese', 'scoresDomaines', 'resultatsDetailles', 
              'matriceRisques', 'planAction', 'glossaireRessources'
            ]
          }
        }
      });
      console.log("SUCCESS");
  } catch (e) {
    console.error('FAIL:', e.message);
  }
}
run();
