import { Component, inject, signal } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-department',
  imports: [ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './edit-department.html',
  styleUrl: './edit-department.css',
})
export class EditDepartment {
  private departmentService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public permissionService = inject(PermissionService);


  departmentForm: FormGroup;
  serverError = signal('');
  backendError: any = {};
  originalFormValue: any;

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(250)]]
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!this.permissionService.hasPermission('department.update')) {
      alert("you dont have permission")
      this.router.navigate(['departments']);
    }
    this.departmentService.getDepartmentById(id as string).subscribe({
      next: (res: any) => {
        this.departmentForm.patchValue(res.data);
        this.originalFormValue = this.departmentForm.value;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    this.serverError.set('');
    this.backendError = {};

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    //  console.log(this.departmentForm.value);
    const formData = new FormData();
    const id = this.route.snapshot.paramMap.get('id');
    // formData.append('name', this.departmentForm.value.name);
    // formData.append('description', this.departmentForm.value.description);
    const payload = {
      name: this.departmentForm.value.name,
      description: this.departmentForm.value.description
    }
    this.departmentService.updateDepartment(id as string, payload)
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
    if (this.originalFormValue) {
      this.departmentForm.patchValue(this.originalFormValue);
      this.serverError.set('');
      this.backendError = {};
    }
  }
}

