import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviornment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}/attendance`;

  checkIn() {
    return this.http.post(`${this.apiUrl}`, {}, {
      withCredentials: true
    })
  }

  checkOut() {
    return this.http.put(`${this.apiUrl}`, {}, {
      withCredentials: true
    })
  }

  getMyTodayAttendance() {
    return this.http.get(`${this.apiUrl}/myToday`, {
      withCredentials: true
    });
  }

  myAttendance() {
    return this.http.get(`${this.apiUrl}/myAttendance`, {
      withCredentials: true
    })
  }

  //team
  getTodaysAttendance() {
    return this.http.get(`${this.apiUrl}/today`, {
      withCredentials: true
    })
  }
  //team
  getAttendanceHistory() {
    return this.http.get(`${this.apiUrl}/attendancehistory`, {
      withCredentials: true
    })
  }
  //organization
  getOrganizationAttendance() {
    return this.http.get(`${this.apiUrl}/organization/today`, {
      withCredentials: true
    })
  }
  //organization
  getOrganizationAttendanceHistory() {
    return this.http.get(`${this.apiUrl}/organization/attendancehistory`, {
      withCredentials: true
    })
  }

}
