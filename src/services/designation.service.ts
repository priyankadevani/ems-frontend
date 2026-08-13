import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;
  getDesignations(search: String, sort: String, page: Number, limit: Number) {
    let params = new HttpParams()
      .set("search", search.toString())
      .set("sort", sort.toString())
      .set("page", page.toString())
      .set("limit", limit.toString());
    return this.http.get(`${this.apiUrl}/designations`, {
      params,
      withCredentials: true
    });
  }

  addDesignation(department: any) {
    return this.http.post(`${this.apiUrl}/designations`, department, { withCredentials: true })
  }

  getDesignationById(id: string) {
    return this.http.get(`${this.apiUrl}/designations/${id}`, { withCredentials: true })
  }

  updateDesignation(id: string, designation: any) {
    return this.http.put(`${this.apiUrl}/designations/${id}`, designation, { withCredentials: true })
  }
  deleteDesignation(id: string) {
    return this.http.delete(`${this.apiUrl}/designations/${id}`, { withCredentials: true })
  }
}
