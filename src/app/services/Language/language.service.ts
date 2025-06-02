import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'app-language';
  private currentLang: string;

  constructor() {
    const savedLang = localStorage.getItem(this.storageKey);
    this.currentLang = savedLang ?? 'vi'; // If savedLang is null or undefined, it defaults to 'vi'.
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
    localStorage.setItem(this.storageKey, lang);
  }

  getLanguage(): string {
    return this.currentLang;
  }
}
