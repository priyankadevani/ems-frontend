import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';
import { Dashboard } from '../models/dashboard.model';

export interface DashboardResponse {

  success: boolean;

  data: Dashboard;

}

@Injectable({
  providedIn: 'root',
})
export class DashboardServiceJs {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;

  getDashboard() {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/dashboard`, {
      withCredentials: true
    });
  }
}
