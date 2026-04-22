import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'gouvernance',
    title: 'Gouvernance et organisation',
    questions: [
      { id: 'g1', text: 'Un responsable de la sécurité informatique est-il identifié ?' },
      { id: 'g2', text: 'Une politique de sécurité informatique existe-t-elle, même informelle ?' },
      { id: 'g3', text: 'Les employés ont-ils reçu une sensibilisation cyber au cours des 12 derniers mois ?' },
      { id: 'g4', text: 'Un inventaire des équipements et logiciels est-il tenu à jour ?' },
      { id: 'g5', text: "L'entreprise a-t-elle déjà réalisé un audit ou diagnostic cyber ?" },
    ]
  },
  {
    id: 'acces',
    title: 'Gestion des accès et des identités',
    questions: [
      { id: 'a1', text: 'Les mots de passe sont-ils soumis à une règle de complexité (12 caractères minimum, majuscules, chiffres, caractères spéciaux) ?' },
      { id: 'a2', text: "L'authentification à double facteur (MFA) est-elle activée sur les accès critiques (messagerie, cloud, VPN) ?" },
      { id: 'a3', text: "Les droits d'accès sont-ils attribués selon le principe du moindre privilège ?" },
      { id: 'a4', text: 'Les comptes des anciens employés sont-ils supprimés immédiatement après leur départ ?' },
      { id: 'a5', text: 'Un gestionnaire de mots de passe est-il utilisé ?' },
    ]
  },
  {
    id: 'reseau',
    title: 'Protection des postes et du réseau',
    questions: [
      { id: 'r1', text: "Les systèmes d'exploitation et logiciels sont-ils mis à jour régulièrement (correctifs de sécurité) ?" },
      { id: 'r2', text: 'Un antivirus ou EDR est-il installé et actif sur tous les postes ?' },
      { id: 'r3', text: 'Le réseau Wi-Fi est-il segmenté (réseau invité séparé du réseau interne) ?' },
      { id: 'r4', text: 'Un pare-feu est-il en place et configuré ?' },
      { id: 'r5', text: 'Les employés travaillant à distance utilisent-ils un VPN ?' },
    ]
  },
  {
    id: 'sauvegarde',
    title: "Sauvegarde et continuité d'activité",
    questions: [
      { id: 's1', text: 'Des sauvegardes automatiques sont-elles effectuées régulièrement ?' },
      { id: 's2', text: 'Les sauvegardes sont-elles stockées hors site ou dans un cloud sécurisé séparé ?' },
      { id: 's3', text: 'La restauration des sauvegardes a-t-elle été testée au cours des 12 derniers mois ?' },
      { id: 's4', text: "Un plan de reprise d'activité (PRA) existe-t-il, même sommaire ?" },
      { id: 's5', text: 'Les données critiques sont-elles identifiées et priorisées ?' },
    ]
  },
  {
    id: 'messagerie',
    title: 'Messagerie et gestion des données',
    questions: [
      { id: 'm1', text: 'Un filtre anti-spam et anti-phishing est-il actif sur la messagerie ?' },
      { id: 'm2', text: 'Les pièces jointes reçues par email sont-elles analysées automatiquement ?' },
      { id: 'm3', text: 'Les données personnelles clients sont-elles traitées en conformité avec le RGPD ?' },
      { id: 'm4', text: "L'entreprise utilise-t-elle des services cloud ?" },
      { id: 'm5', text: 'Si oui, les conditions de sécurité des prestataires ont-elles été vérifiées ?' },
      { id: 'm6', text: 'Les données sensibles sont-elles chiffrées (en transit et au repos) ?' }
    ]
  },
  {
    id: 'incidents',
    title: 'Gestion des incidents',
    questions: [
      { id: 'i1', text: "Une procédure de signalement d'incident cyber existe-t-elle ?" },
      { id: 'i2', text: "L'entreprise sait-elle à qui signaler une cyberattaque (ANSSI, CNIL, assureur) ?" },
      { id: 'i3', text: "L'entreprise a-t-elle souscrit une assurance cyber ?" },
      { id: 'i4', text: "Un incident ou une tentative d'intrusion a-t-il été détecté au cours des 24 derniers mois ?" },
      { id: 'i5', text: 'Les prestataires informatiques externes ont-ils été évalués sur leurs pratiques de sécurité ?' },
    ]
  }
];
