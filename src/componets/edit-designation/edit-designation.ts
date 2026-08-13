import { Component, inject, signal } from '@angular/core';
import { DesignationService } from '../../services/designation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-designation',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-designation.html',
  styleUrl: './edit-designation.css',
})
export class EditDesignation {
  private departmentService = inject(DesignationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public permissionService = inject(PermissionService);


  designationForm: FormGroup;
  serverError = signal('');
  backendError: any = {};
  originalFormValue: any;

  constructor() {
    this.designationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(250)]]
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!this.permissionService.hasPermission('designation.update')) {
      alert("you dont have permission")
      this.router.navigate(['designations']);
    }
    this.departmentService.getDesignationById(id as string).subscribe({
      next: (res: any) => {
        this.designationForm.patchValue(res.data);
        this.originalFormValue = this.designationForm.value;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    this.serverError.set('');
    this.backendError = {};

    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }
    //  console.log(this.departmentForm.value);
    const formData = new FormData();
    const id = this.route.snapshot.paramMap.get('id');
    // formData.append('name', this.departmentForm.value.name);
    // formData.append('description', this.departmentForm.value.description);
    const payload = {
      name: this.designationForm.value.name,
      description: this.designationForm.value.description
    }
    this.departmentService.updateDesignation(id as string, payload)
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
    if (this.originalFormValue) {
      this.designationForm.patchValue(this.originalFormValue);
      this.serverError.set('');
      this.backendError = {};
    }
  }
}
