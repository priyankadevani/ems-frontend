import { Component, ElementRef, inject, OnInit, signal, ViewChild, type Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../services/employees';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../services/permission.service';
import { minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css',
})
export class CreateEmployee implements OnInit {
  roles: any = [];
  selectedFile: File | null = null;
  imagePrev = signal('');
  private employeeService = inject(EmployeesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public permissionService = inject(PermissionService)
  employeeForm: FormGroup;
  serverError = signal('');
  backendError: any = {};
  departments: any[] = [];
  designations: any[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      role: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })


  }
  ngOnInit(): void {
    this.employeeService.getRoles().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.roles = res.data.roles;
        console.log(this.roles);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.employeeService.getDepartments().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.departments = res.data;
        console.log(this.departments);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.employeeService.getDesignations().subscribe({
      next: (res: any) => {
        this.designations = res.data;
        console.log(this.designations);
      }
    })

  }
  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imagePrev.set(URL.createObjectURL(this.selectedFile));
    }
  }
  onSubmit() {
    this.serverError.set('');
    this.backendError = {};

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (!this.permissionService.hasPermission('employee.create')) {
      alert("You don't have permission.");
      return;
    }
    const formData = new FormData();

    if (this.employeeForm.valid) {
      formData.append('firstName', this.employeeForm.get('firstName')?.value);
      formData.append('lastName', this.employeeForm.get('lastName')?.value);
      formData.append('email', this.employeeForm.get('email')?.value);
      formData.append('phone', this.employeeForm.get('phone')?.value);
      formData.append('department', this.employeeForm.get('department')?.value);
      formData.append('designation', this.employeeForm.get('designation')?.value);
      formData.append('role', this.employeeForm.get('role')?.value);
      formData.append('joiningDate', this.employeeForm.get('joiningDate')?.value);
      formData.append('salary', this.employeeForm.get('salary')?.value);
      formData.append('password', this.employeeForm.get('password')?.value);

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);

      }

      this.employeeService.addEmployee(formData).subscribe({
        next: (res: any) => {
          //console.log(res);
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.log(err);
          if (err.error.errors) {

            Object.keys(err.error.errors).forEach(field => {
              const control = this.employeeForm.get(field);
              control?.setErrors({
                ...control.errors,
                server: err.error.errors[field]
              })
            }
            )
          }
          else {
            this.serverError.set(err.error.message);
          }
          //
          // if (err.error.errors) {
          //   this.backendError = err.error.errors;
          // }
          // console.log(this.serverError());
          // console.log(this.backendError);

        }
      });
    }
  }
  onCancel() {
    this.employeeForm.reset();
    this.selectedFile = null;
    this.imagePrev.set('');
    this.fileInput.nativeElement.value = "";
  }

}
