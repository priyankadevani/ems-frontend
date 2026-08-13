import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviornment } from '../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${enviornment.apiUrl}`;
  private currentUser = signal<any>(null);
  currentUserSignal = this.currentUser.asReadonly();
  private checkedIntialAuth = false;
  private permissionservice = inject(PermissionService);

  loadCurrentUser() {
    return this.http.get<LoginResponse>(
      `${this.apiUrl}/me`,
      {
        withCredentials: true
      }
    ).pipe(
      tap((Response) => {
        this.setLoggedIn(Response.data.user)
      })
    );
  }
  setPermissionsAfterRefresh(user: any) {
    this.setLoggedIn(user);
  }

  getCurrentUser() {
    return this.currentUser();
  }
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
  setLoggedIn(data: any) {
    this.currentUser.set(data);
    //console.log("fromauth.ts", this.currentUser());
    this.checkedIntialAuth = true;
    this.permissionservice.setPermissions(data.permissions);
  }
  clearAuthData() {
    this.currentUser.set(null);
    this.checkedIntialAuth = false;
  }
  hasCheckedIntialAuth(): boolean {
    return this.checkedIntialAuth
  }
  getUserRoleName(): string | null {
    const user = this.currentUser();
    console.log("user:", user)
    return user?.role?.roleName || null;
  }
  registerUser(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  loginUser(data: any) {
    return this.http.post(`${this.apiUrl}`, data, {
      withCredentials: true
    }).pipe(tap((Response: any) => {
      if (Response?.data?.user) {
        // console.log('Login API Response:', Response);
        this.setLoggedIn(Response.data.user);
        //  console.log('set login:', this.setLoggedIn);
      }
    }))
  }
  waitForAuth(): Observable<boolean> {

    if (this.checkedIntialAuth) {
      return of(true);
    }

    return this.refreshToken().pipe(
      map(() => true),
      catchError(() => of(false))
    );

  }
  refreshToken() {
    return this.http.post(
      `${this.apiUrl}/refresh-token`,
      {},
      {
        withCredentials: true
      }
    ).pipe(tap((Response: any) => {
      const user = Response.data.user;

      console.log("User after refresh:", user);

      // this.permissionservice.setPermissions(
      //   user.permissions
      // );
      this.setLoggedIn(user);
    }));
  }
  logout() {
    this.clearAuthData();
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},

      {
        withCredentials: true
      }
    );
  }
}
