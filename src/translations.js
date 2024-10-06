// src/translations.js
import enTranslations from "./locales/en.json";
import ruTranslations from "./locales/ru.json";

const translations = {
  en: enTranslations,
  ru: ruTranslations,
};

export function getTranslation(language, key) {
  return translations[language][key];
}
