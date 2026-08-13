import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Role-based guard.
 * Usage in routes:
 *   { path: 'roles', component: RolelistComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } }
 *
 * The `roles` array in route data lists the role names that are allowed to access the route.
 * If the current user's role is not in the list, they are redirected to /employees.
 */
// export const roleGuard: CanActivateFn = (route, _state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // Get the list of allowed roles from route data
//   const allowedRoles: string[] = route.data?.['roles'] ?? [];
//   console.log("allowrdRoles:", allowedRoles)
//   // If no roles are specified, deny access
//   if (allowedRoles.length === 0) {
//     router.navigate(['/employees']);
//     return false;
//   }

//   const userRole = authService.getUserRoleName();
//   console.log("userRole: ", userRole);

//   if (userRole && allowedRoles.includes(userRole)) {
//     return true;
//   }

//   // User doesn't have the required role – redirect to a safe page
//   router.navigate(['/employees']);
//   return false;
// };
