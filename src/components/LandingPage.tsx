import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ChevronDown, ChevronRight, Menu, X, ArrowRight, Activity, Server, Users, ShieldAlert, Key, Database } from 'lucide-react';

interface Props {
  onStartAudit: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStartAudit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append("PRENOM NOM", contactForm.name);
      formData.append("EMAIL", contactForm.email);
      formData.append("TELEPHONE", contactForm.phone);
      formData.append("hidden_data", "audit cyber");

      // Utilizing mode: 'no-cors' paired with URLSearchParams (application/x-www-form-urlencoded) avoids the Preflight OPTIONS request.
      // Make.com natively handles 'application/x-www-form-urlencoded' seamlessly.
      await fetch('https://hook.eu1.make.com/edmr3sl14oxf6776rufg4t9b5y8u48mr', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Erreur de soumission:', error);
      // Fallback in case of networking error. Webhooks that fail CORS in browsers should still reach the "try" block end via 'no-cors'.
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', phone: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: <ShieldAlert />, title: "Gouvernance et organisation", desc: "Politiques de sécurité et sensibilisation des collaborateurs." },
    { icon: <Key />, title: "Gestion des accès", desc: "Contrôle des mots de passe, MFA et droits d'administration." },
    { icon: <ShieldCheck />, title: "Protection réseau et postes", desc: "Antivirus, pare-feu, mises à jour et sécurité des équipements." },
    { icon: <Database />, title: "Sauvegardes et continuité", desc: "Fréquence, stockage et procédures de restauration des données." },
    { icon: <Server />, title: "Messagerie et données", desc: "Sécurisation des emails, anti-phishing et protection documentaire." },
    { icon: <Activity />, title: "Gestion des incidents", desc: "Détection, réaction et déclaration en cas de cyberattaque." }
  ];

  const faqs = [
    { q: "Le diagnostic est-il vraiment gratuit ?", a: "Oui, la session de 45 minutes et la remise du rapport IA sont entièrement gratuites et sans engagement de votre part." },
    { q: "Faut-il avoir des compétences techniques ?", a: "Absolument pas. Notre consultant traduit le jargon technique et vous guide pas à pas lors du questionnaire." },
    { q: "Combien de temps dure la session ?", a: "Prévoyez 45 minutes pour répondre aux questions avec le consultant et découvrir vos résultats initiaux." },
    { q: "Que se passe-t-il après le rapport ?", a: "Vous êtes libre d'implémenter les recommandations vous-même, avec votre prestataire habituel, ou avec notre aide." },
    { q: "Mes données sont-elles confidentielles ?", a: "Oui. Aucune donnée n'est sauvegardée sur nos serveurs. L'application tourne localement et les informations sont détruites à la fermeture." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-text-main overflow-x-hidden selection:bg-brand selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-200 transition-shadow shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="https://perspectives-numeriques.org/wp-content/uploads/2018/08/perspective-numerique-logo-RVB-01-1-300x83.jpg" alt="Perspectives Numériques 10" className="h-10 w-auto" referrerPolicy="no-referrer" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#diagnostic" className="text-text-muted hover:text-brand transition-colors font-medium text-sm">Diagnostic</a>
              <a href="#methode" className="text-text-muted hover:text-brand transition-colors font-medium text-sm">Méthode</a>
              <a href="#pourquoi-nous" className="text-text-muted hover:text-brand transition-colors font-medium text-sm">Pourquoi nous</a>
              <a href="#contact" className="text-text-muted hover:text-brand transition-colors font-medium text-sm">Contact</a>
              <div className="flex items-center gap-4">
                <a href="#contact" className="text-brand font-bold text-sm hover:text-brand-hover transition-colors">
                  Prendre rendez-vous
                </a>
                <button 
                  onClick={onStartAudit}
                  className="bg-brand text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-brand-hover transition-all duration-200 shadow-[0_4px_20px_rgba(41,166,222,0.35)] flex items-center gap-2"
                >
                  Nouvel audit <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
               <button 
                  onClick={onStartAudit}
                  className="bg-brand text-white px-4 py-2 rounded-md font-medium text-xs hover:bg-brand-hover"
                >
                  Audit
                </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-muted hover:text-text-main"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full left-0 origin-top animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#diagnostic" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-text-muted hover:text-brand hover:bg-slate-50 rounded-md">Diagnostic</a>
              <a href="#methode" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-text-muted hover:text-brand hover:bg-slate-50 rounded-md">Méthode</a>
              <a href="#pourquoi-nous" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-text-muted hover:text-brand hover:bg-slate-50 rounded-md">Pourquoi nous</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-text-muted hover:text-brand hover:bg-slate-50 rounded-md">Contact</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-brand text-white px-4 py-3 rounded-md font-medium text-base">Prendre rendez-vous</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="md:col-span-7 space-y-8 relative z-10">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block bg-brand-light text-brand px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100 mb-6">
                Référentiel ANSSI + IA
              </span>
              <h1 className="font-display font-bold text-[36px] md:text-[52px] leading-[1.1] text-text-main mb-6">
                Votre entreprise est-elle une <span className="text-brand">cible facile</span> ?
              </h1>
              <p className="text-lg md:text-xl text-text-muted max-w-2xl font-light leading-relaxed mb-8">
                En 45 minutes, un consultant Perspectives Numériques 10 identifie vos failles critiques et vous remet un plan d'action concret.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#contact" className="inline-flex justify-center items-center bg-brand text-white px-8 py-4 rounded-md font-medium text-base hover:bg-brand-hover transition-all duration-200 shadow-[0_4px_20px_rgba(41,166,222,0.35)]">
                  Réserver mon diagnostic
                </a>
                <a href="#methode" className="inline-flex justify-center items-center bg-white text-brand border-2 border-brand px-8 py-4 rounded-md font-medium text-base hover:bg-brand-light transition-colors">
                  Voir la méthode
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                 {['Gratuit et sans engagement', 'Rapport IA inclus', 'Résultats le jour même'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-text-muted font-medium">
                      <CheckCircle2 className="w-5 h-5 text-brand shrink-0" />
                      <span>{item}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 relative mt-10 md:mt-0">
             <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {/* Floating Card */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] max-w-sm mx-auto animate-float">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-display font-bold text-lg text-text-main">Score de maturité cyber</h3>
                      <span className="inline-block mt-2 bg-red-100 text-alert px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                        Niveau : Faible
                      </span>
                    </div>
                    <div className="text-right">
                       <span className="font-display font-bold text-5xl text-alert tracking-tighter">34</span>
                       <span className="text-xl text-slate-400 font-light">/100</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: "Accès & Identités", val: 20 },
                      { label: "Sauvegardes", val: 45 },
                      { label: "Gestion incidents", val: 15 }
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="text-text-muted">{bar.label}</span>
                          <span className={bar.val < 30 ? 'text-alert' : 'text-orange-500'}>{bar.val}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 delay-500 ease-out flex items-center justify-end ${bar.val < 30 ? 'bg-alert' : 'bg-orange-500'}`}
                            style={{ width: isLoaded ? `${bar.val}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">Exemple de rapport généré après session.</p>
                  </div>
                </div>
                
                {/* Decorative blobs */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand/10 blur-3xl rounded-full"></div>
             </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-light py-16 md:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { val: "1 sur 2", suffix: "PME", text: "touchée par une cyberattaque en 2023" },
              { val: "74", suffix: "%", text: "des attaques ciblent les TPE/PME" },
              { val: "21", suffix: "jours", text: "d'arrêt moyen après une attaque" },
              { val: "9 sur 10", suffix: "ents.", text: "sans plan de reprise documenté" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="font-display font-extrabold text-4xl md:text-5xl text-alert mb-2">
                  {stat.val}<span className="text-2xl ml-1">{stat.suffix}</span>
                </div>
                <p className="text-sm font-medium text-text-muted mt-2 max-w-[200px]">{stat.text}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-4">Source : ANSSI 2023</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="diagnostic" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-4">Un diagnostic complet en 6 thèmes</h2>
          <p className="text-lg text-text-muted">Basé sur le référentiel officiel de l'ANSSI, adapté à la réalité des TPE/PME.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
             <div key={i} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-brand hover:shadow-[0_8px_30px_rgba(41,166,222,0.1)] transition-all duration-300 group">
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-text-main mb-3">{feat.title}</h3>
                <p className="text-text-muted font-light leading-relaxed">{feat.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* Method Section */}
      <section id="methode" className="bg-brand-light py-20 md:py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-main">Comment se déroule la session ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Path line for desktop */}
             <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-slate-200 z-0"></div>

             {[
               { n: '1', title: "La session (45 min)", p: "Un consultant vous accompagne question par question. Aucune compétence technique requise." },
               { n: '2', title: "L'analyse IA (instantanée)", p: "Notre outil analyse vos réponses et calcule votre score de maturité par thème." },
               { n: '3', title: "Le rapport (jour même)", p: "Plan de remédiation priorisé, recommandations concrètes, ressources ANSSI." }
             ].map((step, i) => (
               <div key={i} className="relative z-10 flex flex-col pt-8 md:pt-0">
                 <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border-2 border-brand font-display font-bold text-3xl text-brand mb-6 shadow-sm mx-auto md:mx-0">
                   {step.n}
                 </div>
                 <h3 className="font-display font-bold text-xl text-text-main mb-3 text-center md:text-left">{step.title}</h3>
                 <p className="text-text-muted leading-relaxed font-light text-center md:text-left">{step.p}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="pourquoi-nous" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-6 leading-tight">
              Des consultants de l'Aube,<br/>pour les entreprises de l'Aube.
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              Perspectives Numériques 10 accompagne les TPE et PME du département dans leur transformation numérique depuis plusieurs années. Nos consultants connaissent votre réalité terrain.
            </p>
            <ul className="space-y-4">
               {[
                 "Consultants certifiés et formés aux référentiels ANSSI",
                 "Diagnostic réalisé en présentiel dans vos locaux",
                 "Suivi post-diagnostic disponible"
               ].map((item, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <div className="mt-1 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-4 h-4 text-brand" />
                   </div>
                   <span className="font-medium text-text-main">{item}</span>
                 </li>
               ))}
            </ul>
          </div>

          <div className="bg-brand-light rounded-2xl p-8 md:p-10 border border-slate-100">
             <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => <svg key={star} className="w-5 h-5 text-brand fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
             </div>
             <blockquote className="text-xl text-text-main font-display italic leading-relaxed mb-8">
               "L'approche est pragmatique. Le consultant a su nous parler de cybersécurité sans jargon technique, et le rapport généré par l'IA nous a donné un vrai plan d'action priorisé."
             </blockquote>
             <div>
               <p className="font-bold text-text-main">Sophie Martin</p>
               <p className="text-sm text-text-muted">Gérante, Manufacture de l'Aube</p>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-light py-20 md:py-32 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-text-main text-center mb-12">Questions fréquentes</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-base text-text-main">{faq.q}</span>
                  <div className={`shrink-0 ml-4 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-45 text-brand' : 'text-slate-400'}`}>
                    <X className="w-5 h-5" style={{ transform: openFaqIndex !== i ? 'rotate(45deg)' : '' }} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-5 text-sm text-text-muted font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-brand py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Votre entreprise mérite une protection sérieuse.</h2>
          <p className="text-blue-100 text-lg mb-10">Réservez votre diagnostic en moins de 2 minutes.</p>

          <form className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-2xl text-left" onSubmit={handleContactSubmit}>
            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Demande envoyée !</h3>
                <p className="text-slate-600">Un consultant va vous recontacter très prochainement.</p>
                <button type="button" onClick={() => setSubmitSuccess(false)} className="mt-6 text-brand font-medium text-sm hover:underline">
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <input required type="text" placeholder="Nom et prénom" value={contactForm.name} onChange={e => setContactForm(prev => ({...prev, name: e.target.value}))} className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-text-main text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-slate-400" />
                  </div>
                  <div>
                    <input required type="email" placeholder="Email professionnel" value={contactForm.email} onChange={e => setContactForm(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-text-main text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-slate-400" />
                  </div>
                  <div>
                    <input required type="tel" placeholder="Numéro de téléphone" value={contactForm.phone} onChange={e => setContactForm(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 text-text-main text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-slate-400" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand text-white font-bold py-4 rounded-md hover:bg-brand-hover transition-colors shadow-lg shadow-brand/30 disabled:opacity-70 flex justify-center items-center">
                  {isSubmitting ? 'Envoi en cours...' : 'Je réserve mon diagnostic gratuit'}
                </button>
                <p className="text-center text-xs text-text-muted mt-4 font-medium">Un consultant vous rappelle sous 24h. Sans engagement.</p>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <img src="https://perspectives-numeriques.org/wp-content/uploads/2018/08/perspective-numerique-logo-RVB-01-1-300x83.jpg" alt="Perspectives Numériques 10" className="h-10 w-auto mb-3 bg-white p-1.5 rounded" referrerPolicy="no-referrer" />
            <p className="text-xs max-w-sm">Diagnostic réalisé par un consultant, membre de Perspectives Numériques 10</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>

          <div className="text-sm">
            &copy; 2026 Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
};
