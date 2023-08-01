import { createI18n } from "vue-i18n";
import siteConfig from "@/config/site";

export function loadLanguages() {
  const context = import.meta.globEager("./lang/*/*.ts");
  const languages: AnyObject = {};
  const langs = Object.keys(context);
  for (const key of langs) {
    if (key === "./index.ts") return;
    const lang = context[key].lang;
    const name = key.split("/")[2];
    languages[name] = { ...languages[name], ...lang };
  }

  return languages;
}
const currentLocale = uni.getStorageSync("locale") || siteConfig.locale;
export const i18n = createI18n({
  // globalInjection: true,
  // legacy: false,
  locale: currentLocale,
  fallbackLocale: currentLocale,
  messages: loadLanguages(),
});

export const i18nt = i18n.global.t;

export function setLanguage(locale: string) {
  i18n.global.locale = locale;
}
