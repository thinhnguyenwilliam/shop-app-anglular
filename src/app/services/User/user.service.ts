import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDto } from 'src/app/dtos/user/user-register.dto';
import { UserRegisterResponseDto } from 'src/app/dtos/user/user-register-response.dto';
import { UserLoginDto } from 'src/app/dtos/user/login.dto';
import { UserLoginResponseDto } from 'src/app/dtos/user/login-response.dto';
import { environment } from 'src/environments/environment';
import { HttpService } from '../Http/http.service';
import { UserResponse } from 'src/app/dtos/user/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly httpService: HttpService,
  ) { }

  registerUser(userData: UserRegisterDto): Observable<UserRegisterResponseDto> {
    return this.http.post<UserRegisterResponseDto>(
      `${this.apiUrl}/users/register`,
      userData,
      { headers: this.httpService.createHeaders(), withCredentials: true }
    );
  }

  login(userData: UserLoginDto): Observable<UserLoginResponseDto> {
    return this.http.post<UserLoginResponseDto>(
      `${this.apiUrl}/users/login`,
      userData,
      { headers: this.httpService.createHeaders(), withCredentials: true }
    );
  }

  getUserDetail(token: string): Observable<UserResponse> {
    const headers = this.httpService.createAuthHeaders(token);
    return this.http.post<UserResponse>(`${this.apiUrl}/users/details`, {}, { headers });
  }


  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  
  getUserResponseFromLocalStorage() {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }

}
