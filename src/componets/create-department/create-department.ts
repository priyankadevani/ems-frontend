import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-create-department',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-department.html',
  styleUrl: './create-department.css',
})
export class CreateDepartment implements OnInit {
  private departmentService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public permissionService = inject(PermissionService);

  departmentForm: FormGroup;
  serverError = signal('');
  backendError: any = {};

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(250)]]
    })
  }

  ngOnInit(): void {
    if (!this.permissionService.hasPermission('department.create')) {
      alert("you dont have permission")
      this.router.navigate(['departments']);
    }
  }

  onSubmit() {
    this.serverError.set('');
    this.backendError = {};

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    console.log(this.departmentForm.value);
    this.departmentService.addDepartment(this.departmentForm.value)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate(['/departments']);
        },
        error: (err: any) => {
          console.log(err);
          if (err.error.errors) {
            Object.keys(err.error.errors).forEach(field => {
              const control = this.departmentForm.get(field);
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
    this.departmentForm.reset();
    this.serverError.set('');
    this.backendError = {};
  }
}
