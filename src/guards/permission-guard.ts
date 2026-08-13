import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { map } from 'rxjs';

export const permissionGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'];
  console.log("PermissionGuard:", route.routeConfig?.path);

  return authService.waitForAuth().pipe(

    map((authenticated) => {

      if (!authenticated) {
        return router.createUrlTree(['/']);
      }

      if (!requiredPermission) {
        return true;
      }

      if (permissionService.hasPermission(requiredPermission)) {
        return true;
      }

      return router.createUrlTree(['/employees']);

    })

  );

  // if (!requiredPermission) {
  //   console.log("Permission granted");
  //   return true;
  // }

  // if (permissionService.hasPermission(requiredPermission)) {
  //   console.log("Permission granted");
  //   return true;
  // }
  // console.log("Permission denied");
  // return router.createUrlTree(['/employees']);

  // router.navigate(['/employees']);

  // return false;
};