import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';
import { AuthService } from '../../../services/auth';
//import { routes } from '../../app.routes';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  public permissionService = inject(PermissionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  menus = [
    {
      title: "Dashboard",
      icon: "bi-bar-chart-line",
      route: '/dashboard'
    },
    {
      title: "Employees",
      icon: "bi-people",
      route: '/employees',
      permission: 'employee.read'
    },
    {
      title: "Roles",
      icon: "bi-shield-lock",
      route: "/roles",
      permission: 'role.read'
    },
    {
      title: "Departments",
      icon: "bi-diagram-3",
      route: "/departments",
      permission: 'department.read'
    },
    {
      title: "Designations",
      icon: "bi-briefcase",
      route: "/designations",
      permission: 'designation.read'
    },
    {
      title: "Attendance",
      icon: "bi-calendar",
      permission: 'attendance.self',
      open: false,
      children: [
        {
          title: "My Attendance",
          route: "/attendance",
          permission: 'attendance.self'
        },
        {
          title: "Team Attendance",
          route: "/attendance/team",
          permission: 'attendance.team'
        },
        {
          title: "Organization Attendance",
          route: "/attendance/organization",
          permission: 'attendance.organization'
        }
      ]
    }
  ]

  logout() {
    this.authService.logout().subscribe((res: any) => {
      //console.log("Logout successful");
      this.router.navigate(['/']);
    })
  }
}
