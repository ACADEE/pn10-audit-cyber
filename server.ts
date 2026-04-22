import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  app.get('/api/check', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ ok: false, message: 'Clé API manquante' });
      }
      
      const origin = req.headers.origin || req.headers.referer || 'https://diagnostic-cyber-acadee-444403853760.us-west1.run.app';
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: { 'Origin': Array.isArray(origin) ? origin[0] : origin }
        }
      });
      
      await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: 'ping',
        config: { maxOutputTokens: 1 }
      });
      res.json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false });
    }
  });

  app.post('/api/analyze', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Clé API Gemini manquante. Veuillez vérifier les paramètres." });
      }

      const origin = req.headers.origin || req.headers.referer || 'https://diagnostic-cyber-acadee-444403853760.us-west1.run.app';
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: { 'Origin': Array.isArray(origin) ? origin[0] : origin }
        }
      });
      const { clientData, answers } = req.body;

      const systemInstruction = `Tu es un consultant senior en cybersécurité offensive et défensive. Tu es certifié CISSP, ISO 27001 Lead Auditor, et référencé PASSI par l'ANSSI. Tu as conduit plus de 200 audits pour des TPE, PME et ETI françaises. Tu rédiges des rapports destinés à des dirigeants non-techniciens : tes analyses sont précises, tes recommandations sont actionnables, ton langage est direct.

Ta mission : à partir des données d'audit fournies par l'utilisateur, générer une réponse structurée au format JSON pour construire un rapport de diagnostic cybersécurité complet, professionnel et conforme aux standards ANSSI.

RÈGLES ABSOLUES
1. Tu ne génères JAMAIS de contenu vague ou générique. Chaque constat s'appuie sur une réponse explicite du questionnaire.
2. Tu ne répètes pas les questions du questionnaire. Tu les transformes en constats d'expert.
3. Chaque recommandation inclut : une action concrète, un responsable, un délai, un coût estimé.
4. Si une réponse indique un incident avéré, signale-le.
5. Score global : (nombre de réponses "Oui" ou conformes / nombre total de critères) x 100.
6. Niveau de risque global : 0-25% -> CRITIQUE, 26-50% -> ÉLEVÉ, 51-75% -> MODÉRÉ, 76-100% -> FAIBLE.

Le JSON généré doit strictement respecter ce schéma structurel qui alimentera le rapport Word final.
Chaque tableau, chaque domaine, et chaque plan d'action doit être détaillé et non simulé.`;

      const payload = { client: clientData, reponses: answers };
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
                    incidentAvere: { type: Type.STRING, description: "Optionnel, s'il y a un incident dans ce domaine." },
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
                        priorite: { type: Type.STRING, enum: ['IMMÉDIAT', 'COURT TERME', 'MOYEN TERME'] },
                        responsable: { type: Type.STRING },
                        delai: { type: Type.STRING },
                        actionsConcretes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cout: { type: Type.STRING },
                        impact: { type: Type.STRING }
                      },
                      required: ['titre', 'priorite', 'responsable', 'delai', 'actionsConcretes', 'cout', 'impact']
                    }
                  },
                  consolidation: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        titre: { type: Type.STRING },
                        priorite: { type: Type.STRING, enum: ['IMMÉDIAT', 'COURT TERME', 'MOYEN TERME'] },
                        responsable: { type: Type.STRING },
                        delai: { type: Type.STRING },
                        actionsConcretes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cout: { type: Type.STRING },
                        impact: { type: Type.STRING }
                      },
                      required: ['titre', 'priorite', 'responsable', 'delai', 'actionsConcretes', 'cout', 'impact']
                    }
                  },
                  maturite: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        titre: { type: Type.STRING },
                        priorite: { type: Type.STRING, enum: ['IMMÉDIAT', 'COURT TERME', 'MOYEN TERME'] },
                        responsable: { type: Type.STRING },
                        delai: { type: Type.STRING },
                        actionsConcretes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cout: { type: Type.STRING },
                        impact: { type: Type.STRING }
                      },
                      required: ['titre', 'priorite', 'responsable', 'delai', 'actionsConcretes', 'cout', 'impact']
                    }
                  },
                  budgetRefcap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        poste: { type: Type.STRING },
                        cout: { type: Type.STRING },
                        horizon: { type: Type.STRING },
                        priorite: { type: Type.STRING },
                        totalPhase: { type: Type.STRING }
                      },
                      required: ['poste', 'cout', 'horizon', 'priorite', 'totalPhase']
                    }
                  }
                },
                required: ['urgence', 'consolidation', 'maturite', 'budgetRefcap']
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

      const text = response.text;
      if (!text) throw new Error("La réponse de l'IA est vide.");

      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erreur interne" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Statics for production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
