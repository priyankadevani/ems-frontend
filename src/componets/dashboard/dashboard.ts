import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { DashboardServiceJs } from '../../services/dashboard.service.js';
import { Dashboard } from '../../models/dashboard.model';
import { Cards } from '../cards/cards';
import { CommonModule } from '@angular/common';
import { CartCard } from '../cart-card/cart-card';
import { RouterLink } from '@angular/router';
import { DashboardHeader } from '../dashboard-header/dashboard-header';
import { AuthService } from '../../services/auth.js';

@Component({
  selector: 'app-dashboard',
  imports: [Cards, CommonModule, CartCard, RouterLink, DashboardHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardServiceJs);
  private authService = inject(AuthService);
  user = this.authService.currentUserSignal;
  // dashboardData: any = {};
  dashboardData = signal<Dashboard | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadDashboard();

  }
  loadDashboard() {
    this.loading.set(true);

    this.dashboardService.getDashboard().subscribe({
      next: (res: any) => {
        //  console.log(res.data);
        //this.dashboardData = res.data;
        this.dashboardData.set(res.data);
        console.log(this.dashboardData())
        // console.log("Data:", this.dashboardData());
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set("unable to load Dashboard");
        console.log(err);
      }
    })

  }

}
