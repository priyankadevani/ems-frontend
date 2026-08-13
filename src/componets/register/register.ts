import { Component, inject, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerUser: FormGroup;
  private router = inject(Router);
  private authservice = inject(AuthService);
  serverError = signal('');
  constructor(private fb: FormBuilder) {
    this.registerUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    })
  }

  onSubmit() {
    //console.log(this.registerUser.value);
    if (this.registerUser.invalid) {
      return;
    }
    this.authservice.registerUser(this.registerUser.value).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.serverError.set(err.error.message);
        // console.error(this.serverError);

      }
    })
  }
}