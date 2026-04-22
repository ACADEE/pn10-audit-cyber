import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ShadingType } from "docx";
import { saveAs } from "file-saver";
import { ReportData, ClientData } from "../types";

const COLOR_BLUE = "1A2940";
const COLOR_RED = "C0392B";
const COLOR_ORANGE = "E67E22";
const COLOR_GREEN = "27AE60";
const COLOR_YELLOW = "F1C40F";
const COLOR_GRAY_BG = "F4F6F9";

export const generateWordReport = async (client: ClientData, data: ReportData) => {
  const doc = new Document({
    creator: "Consultant Cyber",
    title: `Diagnostic_Cyber_${client.entreprise}`,
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: { font: "Helvetica", size: 20 }, // size is in half-points (20 = 10pt)
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Helvetica-Bold", size: 30, color: COLOR_BLUE }, // 15pt
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Helvetica-Bold", size: 26, color: COLOR_BLUE }, // 13pt
          paragraph: { spacing: { before: 240, after: 120 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }, // 2cm
          },
        },
        children: [
          // COUVERTURE
          new Paragraph({ text: client.entreprise, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "Secteur: " + client.secteur + " - Effectif: " + client.effectif, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "Consultant: " + client.consultant + " | Date: " + new Date(client.date).toLocaleDateString("fr-FR"), alignment: AlignmentType.CENTER }),
          new Paragraph({ text: " ", spacing: { after: 400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Score Global : " + data.couverture.scoreGlobal + "/100\n", size: 48, bold: true }),
              new TextRun({ text: "Niveau de risque : " + data.couverture.niveauRisque, size: 36, bold: true, color: data.couverture.niveauRisque === 'CRITIQUE' ? COLOR_RED : data.couverture.niveauRisque === 'FAIBLE' ? COLOR_GREEN : COLOR_ORANGE }),
            ]
          }),
          new Paragraph({ text: "Critères conformes : " + data.couverture.criteresConformes + " / " + data.couverture.totalCriteres, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "CONFIDENTIEL", alignment: AlignmentType.CENTER, run: { color: COLOR_RED, bold: true, size: 28 }, spacing: { before: 400 } }),
          new Paragraph({ text: "Référentiel appliqué : ANSSI Hygiène Informatique / ISO 27001", alignment: AlignmentType.CENTER }),
          
          // SYNTHÈSE
          new Paragraph({ text: "1 — SYNTHÈSE EXÉCUTIVE", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          new Paragraph({ text: "Scorecard:", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: `Score: ${data.synthese.scorecard.scoreGlobal}/100 | Conformes: ${data.synthese.scorecard.criteresConformes} | Non-conformités: ${data.synthese.scorecard.nonConformites} | Incidents: ${data.synthese.scorecard.incidentsAveres}` }),
          new Paragraph({ text: "Constats majeurs:", heading: HeadingLevel.HEADING_2 }),
          ...data.synthese.constatsMajeurs.map(c => new Paragraph({ text: "• " + c })),
          new Paragraph({ text: "Points positifs:", heading: HeadingLevel.HEADING_2 }),
          ...data.synthese.pointsPositifs.map(p => new Paragraph({ text: "• " + p })),
          new Paragraph({ text: "Recommandation prioritaire:", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.synthese.recommandationPrioritaire, run: { bold: true } }),

          // SCORE PAR DOMAINE
          new Paragraph({ text: "2 — SCORE PAR DOMAINE", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Domaine", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Score Brut", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Score %", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Statut", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Risque", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                ]
              }),
              ...data.scoresDomaines.map(d => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(d.theme)] }),
                  new TableCell({ children: [new Paragraph(d.scoreBrut.toString())] }),
                  new TableCell({ children: [new Paragraph(d.scorePct + "%")] }),
                  new TableCell({ children: [new Paragraph(d.statut)] }),
                  new TableCell({ children: [new Paragraph(d.niveauRisque)] }),
                ]
              }))
            ]
          }),

          // RÉSULTATS DÉTAILLÉS
          new Paragraph({ text: "3 — RÉSULTATS DÉTAILLÉS PAR DOMAINE", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          ...data.resultatsDetailles.flatMap(domaine => [
            new Paragraph({ text: `${domaine.theme} — ${domaine.score}`, heading: HeadingLevel.HEADING_2 }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: "Critère", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                    new TableCell({ children: [new Paragraph({ text: "Réponse", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                    new TableCell({ children: [new Paragraph({ text: "Risque", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  ]
                }),
                ...domaine.criteres.map(c => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(c.intitule)] }),
                    new TableCell({ children: [new Paragraph(c.reponse + (c.precision ? `\n> ${c.precision}` : ''))] }),
                    new TableCell({ children: [new Paragraph(c.niveauRisque)] }),
                  ]
                }))
              ]
            }),
            domaine.incidentAvere ? new Paragraph({ text: "INCIDENT AVÉRÉ: " + domaine.incidentAvere, run: { color: COLOR_RED, bold: true }, spacing: { before: 100 } }) : new Paragraph(""),
            new Paragraph({ text: "Analyse d'expert: " + domaine.analyse, run: { italics: true }, spacing: { before: 100, after: 200 } })
          ]).filter(p => (p as any).options?.text !== ""),

          // PLAN D'ACTION
          new Paragraph({ text: "4 — PLAN D'ACTION DE CYBER-RÉSILIENCE", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          new Paragraph({ text: "Phase 1 - Urgence (0-30 j)", heading: HeadingLevel.HEADING_2 }),
          ...data.planAction.urgence.flatMap(act => [
            new Paragraph({ text: act.titre, run: { bold: true } }),
            new Paragraph(`Responsable: ${act.responsable} | Délai: ${act.delai} | Coût: ${act.cout} | Impact: ${act.impact}`),
            ...act.actionsConcretes.map(a => new Paragraph({ text: "- " + a, indent: { left: 360 } })),
            new Paragraph({ text: " ", spacing: { after: 100 } })
          ]),
          new Paragraph({ text: "Phase 2 - Consolidation (1-3 m)", heading: HeadingLevel.HEADING_2 }),
          ...data.planAction.consolidation.flatMap(act => [
            new Paragraph({ text: act.titre, run: { bold: true } }),
            new Paragraph(`Responsable: ${act.responsable} | Délai: ${act.delai} | Coût: ${act.cout} | Impact: ${act.impact}`),
            ...act.actionsConcretes.map(a => new Paragraph({ text: "- " + a, indent: { left: 360 } })),
            new Paragraph({ text: " ", spacing: { after: 100 } })
          ]),
          new Paragraph({ text: "Phase 3 - Maturité (3-12 m)", heading: HeadingLevel.HEADING_2 }),
          ...data.planAction.maturite.flatMap(act => [
            new Paragraph({ text: act.titre, run: { bold: true } }),
            new Paragraph(`Responsable: ${act.responsable} | Délai: ${act.delai} | Coût: ${act.cout} | Impact: ${act.impact}`),
            ...act.actionsConcretes.map(a => new Paragraph({ text: "- " + a, indent: { left: 360 } })),
            new Paragraph({ text: " ", spacing: { after: 100 } })
          ]),
          new Paragraph({ text: "Tableau Budgétaire:", heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Poste", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Coût", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                  new TableCell({ children: [new Paragraph({ text: "Horizon", run: { bold: true, color: "FFFFFF" } })], shading: { fill: COLOR_BLUE, type: ShadingType.CLEAR } }),
                ]
              }),
              ...data.planAction.budgetRefcap.map(b => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(b.poste)] }),
                  new TableCell({ children: [new Paragraph(b.cout)] }),
                  new TableCell({ children: [new Paragraph(b.horizon)] })
                ]
              }))
            ]
          }),

          // GLOSSAIRE ET RESSOURCES
          new Paragraph({ text: "5 — GLOSSAIRE ET RESSOURCES", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          new Paragraph({ text: "Glossaire", heading: HeadingLevel.HEADING_2 }),
          ...data.glossaireRessources.glossaire.map(g => new Paragraph({ text: `${g.terme} : ${g.definition}` })),
          new Paragraph({ text: "Ressources", heading: HeadingLevel.HEADING_2 }),
          ...data.glossaireRessources.ressources.map(r => new Paragraph({ text: `${r.ressource} : ${r.url}` })),
          
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Diagnostic_Cyber_${client.entreprise.replace(/\s+/g, '_')}.docx`);
};
