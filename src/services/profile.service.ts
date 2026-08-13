import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`, {
      withCredentials: true,
    })
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/profile`, data, {
      withCredentials: true
    })
  }

}
