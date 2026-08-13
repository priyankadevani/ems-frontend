import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;
  getDepartments(search: String, sort: String, page: Number, limit: Number) {
    let params = new HttpParams()
      .set("search", search.toString())
      .set("sort", sort.toString())
      .set("page", page.toString())
      .set("limit", limit.toString());
    return this.http.get(`${this.apiUrl}/departments`, {
      params,
      withCredentials: true
    });
  }

  addDepartment(department: any) {
    return this.http.post(`${this.apiUrl}/departments`, department, { withCredentials: true })
  }

  getDepartmentById(id: string) {
    return this.http.get(`${this.apiUrl}/departments/${id}`, { withCredentials: true })
  }

  updateDepartment(id: string, department: any) {
    return this.http.put(`${this.apiUrl}/departments/${id}`, department, { withCredentials: true })
  }
  deleteDepartment(id: string) {
    return this.http.delete(`${this.apiUrl}/departments/${id}`, { withCredentials: true })
  }
}
