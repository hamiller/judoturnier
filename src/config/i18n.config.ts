import i18n from 'i18n';

i18n.configure({
  locales: ['de'], // Unterstützte Locales
  defaultLocale: 'de', // Standard-Locale
  //directory: __dirname + '/locales', // Pfad zu den Locale-Dateien
  objectNotation: true, // Verwendung von Punkt-Notation für Übersetzungen (z.B. 'message.welcome')
  cookie: 'locale', // Name des Cookies, um das Locale zu speichern
});

export default i18n;
