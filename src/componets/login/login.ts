import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);
  private permissionservice = inject(PermissionService);


  serverError = signal("");

  loginForm = this.fb.group({

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]]

  });

  onSubmit() {
    this.serverError.set("");
    if (this.loginForm.invalid) {
      return;
    }

    //console.log(this.loginForm.value);

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response: any) => {
        // this.authService.setCurrentUser(response.data.user);
        //console.log(response);
        // this.permissionservice.setPermissions(response.data.user.permissions);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        //console.log(error)
        this.serverError.set(error.error.message);
        //console.log(this.serverError());
      }
    })

  }

}

