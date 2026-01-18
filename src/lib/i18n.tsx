import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Lang = 'en' | 'fr' | 'rw'

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.analysis': 'Analysis',
    'nav.liveAnalysis': 'Live Analysis',
    'nav.schedule': 'Schedule',
    'nav.appointments': 'Appointments',
    'nav.notifications': 'Notifications',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'settings.title': 'Settings',
    'settings.description': 'Manage your preferences and account settings.',
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Sign in to your account',
    'login.forgot': 'Forgot password?',
    'login.signin': 'Sign In',
    'register.title': 'Create Account',
    'register.subtitle': 'Join the world of neuroscience with Artificial Intelligence',
    'notfound.return': 'Return to Reality',
    'notfound.message': "⚡ Uh-oh! Your EEG signals have drifted into the neural abyss. We couldn't find this page.",
    'history.title': 'Analysis History',
    'history.description': 'Browse your past EEG sessions and review performance metrics.',
    'appointments.title': 'Appointment Requests',
    'appointments.suggest': 'Suggest Date',
    'appointments.accept': 'Accept',
    'appointments.reject': 'Reject',
    // Dashboard
    'dashboard.welcome': 'Welcome back,',
    'dashboard.cards.totalAnalyses': 'Total Analyses',
    'dashboard.cards.activities': 'Activities',
    'dashboard.cards.reports': 'Reports',
    'dashboard.cards.sessions': 'Sessions',
    'dashboard.recent.title': 'Recent Analysis',
    'dashboard.recent.desc': 'Your latest EEG data processing results',
    'dashboard.upcoming.title': 'Upcoming Sessions',
    'dashboard.upcoming.desc': 'Scheduled data collection',
    // Analysis
    'analysis.title': 'Analysis Tools',
    'analysis.description': 'Upload your EEG data or view previous analysis results. Maximum of 100MB per file.',
    'analysis.upload': 'Upload',
    'analysis.results': 'Results',
    'analysis.uploadHeader': 'Upload your EEG data',
    'analysis.uploadDesc': 'Drag and drop your files here, or click to browse',
    'analysis.analyzing': 'Analyzing...',
    'analysis.selectFiles': 'Select Files',
    'analysis.resultsPlaceholder': 'Your analysis results will appear here.',
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.description': 'Manage your notifications and alerts',
    'notifications.markAll': 'Mark all as read',
    'notifications.clearAll': 'Clear all',
    'notifications.allNotifications': 'All Notifications',
    'notifications.noNotifications': 'No notifications',
    'notifications.caughtUp': "You're all caught up! Check back later for new updates.",
    'notifications.filter.type.placeholder': 'Filter by type',
    'notifications.filter.category.placeholder': 'Filter by category',
    'notifications.markAsRead': 'Mark as read',
    // Profile
    'profile.title': 'Profile',
    'profile.description': 'Manage your profile information and preferences.',
    'profile.personal': 'Personal Info',
    'profile.security': 'Security',
    'profile.account': 'Account',
    'profile.personalInfoTitle': 'Personal Information',
    'profile.personalInfoDesc': 'Update your personal details and profile picture',
    'profile.saveChanges': 'Save Changes',
    'profile.remove': 'Remove',
    'profile.changePassword': 'Change Password',
    'profile.dangerZone': 'Danger Zone',
    'profile.deleteAccount': 'Delete Account',
    // Schedule
    'schedule.title': 'Schedule Sessions',
    'schedule.description': 'Schedule and manage your EEG analysis sessions',
    // Private
    'private.title': 'Private Area',
    'private.description': 'Your confidential data and documents.',
    'private.accessButton': 'Access Private Area',
    'private.placeholderMessage': 'Type a secure message...',
    'private.documents': 'Private Documents',
    'private.messages': 'Secure Messages',
    'private.confidentialReport': 'Confidential Report',
    'private.viewDocument': 'View Document',
    'private.documentsDesc': 'Private documents and reports',
    'private.messagesDesc': 'End-to-end encrypted communications',
    // Live Analysis
    'live.title': 'Live EEG Analysis',
    'live.description': 'Real-time monitoring of cognitive metrics',
    'live.startSession': 'Start Session',
    'live.pause': 'Pause',
    'live.resume': 'Resume Session',
    'live.stopSession': 'Stop Session',
    'live.back': 'Back to Home',
    'live.sessionProgress': 'Session Progress',
    'live.recording': 'Recording and analyzing in real-time',
    'live.metricsTimeline': 'Live Metrics Timeline',
    'live.generatingReport': 'Generating Analysis Report',
    'live.processing': 'Please wait while we process your session data and generate insights',
    // Language Switcher
    'lang.en': 'English',
    'lang.fr': 'Français',
    'lang.rw': 'Ikinyarwanda'
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.analysis': 'Analyse',
    'nav.liveAnalysis': 'Analyse en direct',
    'nav.schedule': 'Planning',
    'nav.appointments': 'Rendez-vous',
    'nav.notifications': 'Notifications',
    'nav.history': 'Historique',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'settings.title': 'Paramètres',
    'settings.description': "Gérez vos préférences et les paramètres de votre compte.",
    'login.welcome': 'Bon retour',
    'login.subtitle': "Connectez-vous à votre compte",
    'login.forgot': 'Mot de passe oublié ?',
    'login.signin': "Se connecter",
    'register.title': "Créer un compte",
    'register.subtitle': "Rejoignez le monde des neurosciences avec l'intelligence artificielle",
    'notfound.return': 'Retour à la réalité',
    'notfound.message': "⚡ Oups ! Vos signaux EEG ont dérivé dans l'abîme neural. Nous n'avons pas trouvé cette page.",
    'history.title': "Historique d'analyse",
    'history.description': "Parcourez vos sessions EEG passées et consultez les métriques de performance.",
    'appointments.title': 'Demandes de rendez-vous',
    'appointments.suggest': 'Proposer une date',
    'appointments.accept': 'Accepter',
    'appointments.reject': 'Refuser',
    // Dashboard
    'dashboard.welcome': 'Bon retour,',
    'dashboard.cards.totalAnalyses': 'Analyses totales',
    'dashboard.cards.activities': 'Activités',
    'dashboard.cards.reports': 'Rapports',
    'dashboard.cards.sessions': 'Sessions',
    'dashboard.recent.title': "Analyses récentes",
    'dashboard.recent.desc': "Vos derniers résultats de traitement EEG",
    'dashboard.upcoming.title': 'Sessions à venir',
    'dashboard.upcoming.desc': 'Collecte de données planifiée',
    // Analysis
    'analysis.title': "Outils d'analyse",
    'analysis.description': "Téléchargez vos données EEG ou consultez les résultats précédents. Taille max: 100MB par fichier.",
    'analysis.upload': 'Téléverser',
    'analysis.results': 'Résultats',
    'analysis.uploadHeader': 'Téléchargez vos données EEG',
    'analysis.uploadDesc': 'Glissez-déposez vos fichiers ici, ou cliquez pour parcourir',
    'analysis.analyzing': 'Analyse en cours...',
    'analysis.selectFiles': 'Sélectionner des fichiers',
    'analysis.resultsPlaceholder': "Vos résultats d'analyse apparaîtront ici.",
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.description': 'Gérez vos notifications et alertes',
    'notifications.markAll': 'Tout marquer comme lus',
    'notifications.clearAll': 'Tout effacer',
    'notifications.allNotifications': 'Toutes les notifications',
    'notifications.noNotifications': 'Aucune notification',
    'notifications.caughtUp': "Vous êtes à jour ! Revenez plus tard pour les nouvelles mises à jour.",
    'notifications.filter.type.placeholder': 'Filtrer par type',
    'notifications.filter.category.placeholder': 'Filtrer par catégorie',
    'notifications.markAsRead': 'Marquer comme lu',
    // Profile
    'profile.title': 'Profil',
    'profile.description': 'Gérez les informations de votre profil et vos préférences.',
    'profile.personal': 'Informations personnelles',
    'profile.security': 'Sécurité',
    'profile.account': 'Compte',
    'profile.personalInfoTitle': 'Informations personnelles',
    'profile.personalInfoDesc': "Mettez à jour vos informations personnelles et votre photo de profil",
    'profile.saveChanges': 'Enregistrer les modifications',
    'profile.remove': 'Supprimer',
    'profile.changePassword': 'Changer le mot de passe',
    'profile.dangerZone': 'Zone dangereuse',
    'profile.deleteAccount': 'Supprimer le compte',
    // Schedule
    'schedule.title': 'Planifier des sessions',
    'schedule.description': "Planifiez et gérez vos sessions d'analyse EEG",
    // Private
    'private.title': 'Espace privé',
    'private.description': 'Vos données et documents confidentiels.',
    'private.accessButton': "Accéder à l'espace privé",
    'private.placeholderMessage': 'Tapez un message sécurisé...',
    'private.documents': 'Documents privés',
    'private.messages': 'Messages sécurisés',
    'private.confidentialReport': 'Rapport confidentiel',
    'private.viewDocument': "Voir le document",
    'private.documentsDesc': 'Documents et rapports privés',
    'private.messagesDesc': 'Communications chiffrées de bout en bout',
    // Live Analysis
    'live.title': "Analyse EEG en direct",
    'live.description': 'Surveillance en temps réel des métriques cognitives',
    'live.startSession': 'Démarrer la session',
    'live.pause': 'Pause',
    'live.resume': 'Reprendre la session',
    'live.stopSession': 'Arrêter la session',
    'live.back': "Retour à l'accueil",
    'live.sessionProgress': 'Progression de la session',
    'live.recording': "Enregistrement et analyse en temps réel",
    'live.metricsTimeline': 'Chronologie des métriques en direct',
    'live.generatingReport': "Génération du rapport d'analyse",
    'live.processing': 'Veuillez patienter pendant que nous traitons vos données de session et générons des informations',
    // Language Switcher
    'lang.en': 'English',
    'lang.fr': 'Français',
    'lang.rw': 'Ikinyarwanda'
  },
  rw: {
    'nav.dashboard': 'Inzira y\'Ubwenge',
    'nav.analysis': 'Isesengura',
    'nav.liveAnalysis': 'Isesengura mu Gihe cjyane',
    'nav.schedule': 'Gutegeka',
    'nav.appointments': 'Ibyatekerezwa',
    'nav.notifications': 'Imyitwarire',
    'nav.history': 'Amateka',
    'nav.profile': 'Umwirondoro',
    'nav.settings': 'Igenamigambi',
    'settings.title': 'Igenamigambi',
    'settings.description': 'Shyiraho ibyifuzo byawe n\'igenamigambi ry\'ikonto.',
    'login.welcome': 'Ijambo ry\'akakira',
    'login.subtitle': 'Injira kumikino yawe',
    'login.forgot': 'Wababaje ijambo ryibanga?',
    'login.signin': 'Injira',
    'register.title': 'Ubwiyunge',
    'register.subtitle': 'Injira mu isi y\'ubwenge hamwe n\'Ikinzira cy\'Ubwenge',
    'notfound.return': 'Garuka mu Gihe cjyane',
    'notfound.message': "⚡ Inda! Ikinzira cyo kugaragaza ubwenge bwawe cyamarika mu gihe cjyane. Hatari paje iyi.",
    'history.title': 'Amateka y\'isesengura',
    'history.description': 'Kora imibare n\'yubwenge bwawe hamwe n\'ibipimo.',
    'appointments.title': 'Ibyatekerezwa',
    'appointments.suggest': 'Tegeka Ubukakambwe',
    'appointments.accept': 'Kubwiyemeza',
    'appointments.reject': 'Kwirukanwa',
    // Dashboard
    'dashboard.welcome': 'Ijambo ry\'akakira,',
    'dashboard.cards.totalAnalyses': 'Isesengura ryose',
    'dashboard.cards.activities': 'Ibikorwa',
    'dashboard.cards.reports': 'Raporo',
    'dashboard.cards.sessions': 'Urubuga',
    'dashboard.recent.title': 'Isesengura nyakuri',
    'dashboard.recent.desc': 'Ibisesengura byawe bisesengura ubwenge',
    'dashboard.upcoming.title': 'Urubuga Rwizabwoba',
    'dashboard.upcoming.desc': 'Gukusanya amakuru agateganijwe',
    // Analysis
    'analysis.title': 'Imboneramusharuro y\'isesengura',
    'analysis.description': 'Ohereza ubwenge bwawe cyangwa reba ibisesengura byabanjirije. Ingano ntarenze MB 100 kuri buri idosiye.',
    'analysis.upload': 'Ohereza',
    'analysis.results': 'Ibisesengura',
    'analysis.uploadHeader': 'Ohereza ubwenge bwawe',
    'analysis.uploadDesc': 'Wika no gutera hano, cyangwa kanda kugusikira i rehero',
    'analysis.analyzing': 'Bisesengura...',
    'analysis.selectFiles': 'Hitamo Idosiye',
    'analysis.resultsPlaceholder': 'Ibisesengura byawe biza ku ya.',
    // Notifications
    'notifications.title': 'Imyitwarire',
    'notifications.description': 'Shyiraho imyitwarire n\'ixabugwaho',
    'notifications.markAll': 'Emeza se ryose',
    'notifications.clearAll': 'Siba ryose',
    'notifications.allNotifications': 'Imyitwarire yose',
    'notifications.noNotifications': 'Nta myitwarire',
    'notifications.caughtUp': "Ubwakurikije! Garuka hanyuma kugira amahoro.",
    'notifications.filter.type.placeholder': 'Gusangiza kurusozo',
    'notifications.filter.category.placeholder': 'Gusangiza ku kagari',
    'notifications.markAsRead': 'Emeza ko bisomwe',
    // Profile
    'profile.title': 'Umwirondoro',
    'profile.description': 'Shyiraho amakuru yawe n\'ibyifuzo.',
    'profile.personal': 'Amakuru y\'Umuntu Jye',
    'profile.security': 'Nzira y\'kurinda',
    'profile.account': 'Ikonto',
    'profile.personalInfoTitle': 'Amakuru y\'Umuntu Jye',
    'profile.personalInfoDesc': 'Subiramo amakuru yawe n\'ifoto yumwirondoro',
    'profile.saveChanges': 'Kubika Impindura',
    'profile.remove': 'Siba',
    'profile.changePassword': 'Hindura Ijambo ry\'ibinga',
    'profile.dangerZone': 'Inzira y\'ibyinzira',
    'profile.deleteAccount': 'Siba Ikonto',
    // Schedule
    'schedule.title': 'Gutegeka Urubuga',
    'schedule.description': 'Tegeka n\'karangira urubuga rwawe',
    // Private
    'private.title': 'Inzira y\'Ubwiyunge',
    'private.description': 'Amakuru na dossiye zawe z\'ubwiyunge.',
    'private.accessButton': 'Injira mu nzira y\'ubwiyunge',
    'private.placeholderMessage': 'Andika ijambo ry\'urinda...',
    'private.documents': 'Dossiye z\'ubwiyunge',
    'private.messages': 'Ujumbe w\'urinda',
    'private.confidentialReport': 'Raporo y\'ubwiyunge',
    'private.viewDocument': 'Reba Dossiye',
    'private.documentsDesc': 'Dossiye n\'raporo z\'ubwiyunge',
    'private.messagesDesc': 'Ubujumbe bwakirije muri roranire',
    // Live Analysis
    'live.title': 'Isesengura mu Gihe cjyane',
    'live.description': 'Kubumva mu gihe cjyane ibibazo bijya mu nshingano',
    'live.startSession': 'Tangira Urubuga',
    'live.pause': 'Hagarika',
    'live.resume': 'Komeza Urubuga',
    'live.stopSession': 'Hagarika Urubuga',
    'live.back': 'Garuka Mu rugo',
    'live.sessionProgress': 'Iterambere ry\'urubuga',
    'live.recording': 'Gufata no bisesengura mu gihe cjyane',
    'live.metricsTimeline': 'Urugo rw\'ibipimo mu gihe cjyane',
    'live.generatingReport': 'Gukora Raporo y\'isesengura',
    'live.processing': 'Tegeka mu gihe tisesengura amakuru yawe n\'gutanga amasugurisho',
    // Language Switcher
    'lang.en': 'English',
    'lang.fr': 'Français',
    'lang.rw': 'Ikinyarwanda'
  }
}

type I18nContextValue = {
  lang: Lang
  t: (key: string) => string
  setLanguage: (l: Lang) => void
  supportedLanguages: readonly Lang[]
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('language:settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.language === 'fr' || parsed.language === 'rw') return parsed.language
      }
    } catch (e) {
      // ignore
    }
    return 'en'
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language:settings')
      const parsed = saved ? JSON.parse(saved) : null
      if (!parsed || parsed.language !== lang) {
        localStorage.setItem('language:settings', JSON.stringify({ ...(parsed || {}), language: lang }))
      }
    } catch (e) {
      // ignore
    }
  }, [lang])

  const t = (key: string) => {
    return translations[lang][key] ?? translations['en'][key] ?? key
  }

  const value = useMemo(
    () => ({
      lang,
      t,
      setLanguage: (l: Lang) => setLang(l),
      supportedLanguages: ['en', 'fr', 'rw'] as const
    }),
    [lang]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export default I18nProvider
