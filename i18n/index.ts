import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const resources = {
  en: {
    translation: require('./en.json')
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  returnNull: false
});

export default i18n;
