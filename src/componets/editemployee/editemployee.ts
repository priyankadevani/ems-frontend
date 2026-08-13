import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../services/employees';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-editemployee',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './editemployee.html',
  styleUrl: './editemployee.css',
})
export class EditemployeeComponent implements OnInit {
  roles: any[] = [];
  imagePrev = signal("");
  selectedFile: File | null = null;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private empService = inject(EmployeesService);
  public permissionService = inject(PermissionService);
  private originalData: any = null;
  private originalImageurl: string = "";
  departments: any[] = [];
  designations: any[] = [];
  serverError = signal<string | null>(null);
  @ViewChild('fileInput') fileInput!: ElementRef;
  editForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    department: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    joiningDate: ['', [Validators.required]],
    salary: ['', [Validators.required, Validators.min(0)]],
    image: [''],
    role: ['', [Validators.required]],
    profileImage: ['']
  });

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imagePrev.set(URL.createObjectURL(this.selectedFile));
    }
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.empService.getRoles().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.roles = res.data.roles;
        console.log("Roles:", this.roles);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.empService.getDepartments().subscribe({
      next: (res: any) => {
        //console.log(res);
        this.departments = res.data;
        //console.log("departments:", this.departments);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.empService.getDesignations().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.designations = res.data;
        // console.log("designations:", this.designations);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.empService.getEmployeeById(id as string).subscribe((response: any) => {
      const empdata = { ...response.data };
      //console.log("Data:", empdata);
      if (empdata.joiningDate) {
        empdata.joiningDate = empdata.joiningDate.split('T')[0];
      }
      if (empdata.profileImage) {
        this.imagePrev.set(empdata.profileImage.url);
        this.originalImageurl = empdata.profileImage.url;
      }
      empdata.email = empdata.userId.email;
      //  console.log(empdata.email);
      empdata.role = empdata.userId.role;
      console.log("Role from employee:", empdata.role);
      empdata.department = empdata.department._id;
      empdata.designation = empdata.designation._id;

      //console.log('emp data:', empdata);
      this.editForm.patchValue(empdata);
      console.log("Form role:", this.editForm.value.role);
      this.originalData = this.editForm.value;
    })

  }

  onSubmit() {
    this.serverError.set('');
    if (!this.permissionService.hasPermission('employee.update')) {
      alert("You don't have permission.");
      return;
    }
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const id = this.route.snapshot.paramMap.get('id');
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }
    formData.append('firstName', this.editForm.value.firstName as string);
    formData.append('lastName', this.editForm.value.lastName as string);
    formData.append('email', this.editForm.value.email as string);
    formData.append('phone', this.editForm.value.phone as string);
    formData.append('department', this.editForm.value.department as string);
    formData.append('designation', this.editForm.value.designation as string);
    formData.append('joiningDate', this.editForm.value.joiningDate as string);
    formData.append('salary', this.editForm.value.salary as string);
    formData.append('role', this.editForm.value.role as string);
    // console.log(id, this.editForm.value);
    this.empService.updateEmployeeData(id as string, formData).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.router.navigate(['/employees']);

      },
      error: (err: any) => {
        console.log(err);
        if (err.error.errors) {

          Object.keys(err.error.errors).forEach(field => {
            const control = this.editForm.get(field);
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
      }
    })
  }

  onClick() {
    if (this.originalData) {
      this.editForm.patchValue(this.originalData);
      this.selectedFile = null;
      this.imagePrev.set(this.originalImageurl);
      this.fileInput.nativeElement.value = "";
    }
  }
}
