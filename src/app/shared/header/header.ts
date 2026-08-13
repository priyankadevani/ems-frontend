import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { DashboardHeader } from '../../../componets/dashboard-header/dashboard-header';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [DashboardHeader, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router)
  currentUser = this.authService.currentUserSignal;

  logout() {
    this.authService.logout().subscribe({
      next: (response: any) => {
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
