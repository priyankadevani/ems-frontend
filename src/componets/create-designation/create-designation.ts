import { Component, inject, signal } from '@angular/core';
import { DesignationService } from '../../services/designation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-designation',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './create-designation.html',
  styleUrl: './create-designation.css',
})
export class CreateDesignation {
  private designationService = inject(DesignationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public permissionService = inject(PermissionService);

  designationForm: FormGroup;
  serverError = signal('');
  backendError: any = {};

  constructor() {
    this.designationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(250)]]
    })
  }

  ngOnInit(): void {
    if (!this.permissionService.hasPermission('designation.create')) {
      alert("you dont have permission")
      this.router.navigate(['designations']);
    }
  }

  onSubmit() {
    this.serverError.set('');
    this.backendError = {};

    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }
    console.log(this.designationForm.value);
    this.designationService.addDesignation(this.designationForm.value)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate(['/designations']);
        },
        error: (err: any) => {
          console.log(err);
          if (err.error.errors) {
            Object.keys(err.error.errors).forEach(field => {
              const control = this.designationForm.get(field);
              control?.setErrors({
                ...control.errors,
                server: err.error.errors[field]
              })
            })
          }
          else {
            this.serverError.set(err.error.message);
          }
        }
      })
  }
  onCancel() {
    this.designationForm.reset();
    this.serverError.set('');
    this.backendError = {};
  }
}
