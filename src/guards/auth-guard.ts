import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, map, of } from 'rxjs';

//import { AuthService } from '../services/auth';
import { PermissionService } from '../services/permission.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  //const permissionService = inject(PermissionService);

  const router = inject(Router);
  console.log("AuthGuard for:", state.url);

  if (authService.isLoggedIn()) {
    console.log("Already logged in");
    return true;
  }
  if (!authService.hasCheckedIntialAuth()) {
    console.log("Calling refresh...");
    return authService.refreshToken().pipe(
      map((response: any) => {

        // authService.setLoggedIn(response.data.user);
        // console.log("Refresh successful");

        // console.log("Response:", response);

        // console.log("Current User:", authService.getCurrentUser());
        // console.log(response.data.user.permissions);
        // console.log(response.data.user.role.permissions);
        // console.log("Auth Guard -> redirecting to login");
        // permissionService.setPermissions(
        //   response.data.user.role.permissions
        // );
        // console.log("Returning TRUE from authGuard");
        return true;
      }),
      catchError((err) => {
        console.error("Auth Guard Error", err);

        authService.clearAuthData();
        console.log("Auth Guard -> redirecting to login");
        //router.navigate(['/']);

        // return of(false);
        return of(router.createUrlTree(['/']));

      })
    );
  }
  // Auth was already checked (refresh attempted) but user is still not logged in
  console.log("Redirecting to login");
  // router.navigate(['/']);
  return of(router.createUrlTree(['/']));
};

