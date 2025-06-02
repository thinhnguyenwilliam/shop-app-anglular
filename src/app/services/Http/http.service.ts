import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LanguageService } from '../Language/language.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': this.languageService.getLanguage()
    });
  }

  createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': this.languageService.getLanguage(),
      Authorization: `Bearer ${token}`
    });
  }

  constructor(private readonly languageService: LanguageService) {}
}
