import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Roleservice {
  private http = inject(HttpClient);
  private apiurl = `${enviornment.apiUrl}`;
  getroles() {
    return this.http.get(`${this.apiurl}/role/`, { withCredentials: true })
  }

  addrole(role: any) {
    return this.http.post(`${this.apiurl}/role/`, role, { withCredentials: true })
  }
  getpermissions() {
    return this.http.get(`${this.apiurl}/permission/`, { withCredentials: true })
  }
  getRoleById(id: any) {
    return this.http.get(`${this.apiurl}/role/${id}`, { withCredentials: true })
  }
  updateRole(id: any, data: any) {
    return this.http.put(`${this.apiurl}/role/${id}`, data, { withCredentials: true })
  }
  deleteRole(id: any) {
    return this.http.delete(`${this.apiurl}/role/${id}`, { withCredentials: true });
  }

}
