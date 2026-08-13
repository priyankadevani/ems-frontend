import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { employee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { enviornment } from '../environments/environment';

export interface EmployeeResponse {
  employees: employee[];
  totalEmployees: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;


  getEmployees(
    search: String,
    sort: String,
    page: Number,
    limit: Number
  ): Observable<EmployeeResponse> {
    let params = new HttpParams()
      .set("search", search.toString())
      .set("sort", sort.toString())
      .set("page", page.toString())
      .set("limit", limit.toString());
    return this.http.get<EmployeeResponse>(`${this.apiUrl}/employee`, {
      // withCredentials: true,
      params
    });


  }
  getEmployeeById(id: string): Observable<employee> {
    return this.http.get<employee>(`${this.apiUrl}/employee/${id}`, {
      withCredentials: true
    });


  }
  addEmployee(employee: any) {
    return this.http.post(`${this.apiUrl}/employee`, employee, {
      withCredentials: true
    });
  }

  updateEmployeeData(id: string, employee: any) {
    return this.http.put(`${this.apiUrl}/employee/${id}`, employee, {
      withCredentials: true
    });
  }
  deleteEmployee(id: string) {
    return this.http.delete(`${this.apiUrl}/employee/${id}`, {
      withCredentials: true
    });
  }
  getDepartments() {
    return this.http.get(`${this.apiUrl}/departments/dropdown`, {
      withCredentials: true
    });
  }
  getDesignations() {
    return this.http.get(`${this.apiUrl}/designations/dropdown`, {
      withCredentials: true
    });
  }
  getRoles() {
    return this.http.get(`${this.apiUrl}/role`, {
      withCredentials: true
    })
  }

}
