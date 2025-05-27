import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/dtos/roles/role.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }


  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  
}
