import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDto } from 'src/app/dtos/user/user-register.dto';
import { UserRegisterResponseDto } from 'src/app/dtos/user/user-register-response.dto';
import { UserLoginDto } from 'src/app/dtos/user/login.dto';
import { UserLoginResponseDto } from 'src/app/dtos/user/login-response.dto';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../Language/language.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept-Language': this.languageService.getLanguage()
  });

  constructor(
    private readonly http: HttpClient,
    private readonly languageService: LanguageService
  ) { }


  registerUser(userData: UserRegisterDto): Observable<UserRegisterResponseDto> {
    return this.http.post<UserRegisterResponseDto>(
      `${this.apiUrl}/users/register`,
      userData,
      { headers: this.headers, withCredentials: true }
    );
  }

  login(userData: UserLoginDto): Observable<UserLoginResponseDto> {
    return this.http.post<UserLoginResponseDto>(
      `${this.apiUrl}/users/login`,
      userData,
      { headers: this.headers, withCredentials: true }
    );
  }
}
