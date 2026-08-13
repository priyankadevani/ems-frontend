import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  ngOnInit() {
    // this.authService.loadCurrentUser().subscribe({
    //   next: (response: any) => {
    //     this.authService.setLoggedIn(response.data.user);
    //     this.permissionService.setPermissions(
    //       response.data.user.permissions
    //     );
    //   },
    //   error: (error: any) => {
    //     console.log(error);
    //     this.authService.clearAuthData();
    //   }
    // })
  }

}
