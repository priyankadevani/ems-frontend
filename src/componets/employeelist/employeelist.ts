import { Component, inject, Signal, signal } from '@angular/core';
import { EmployeesService } from '../../services/employees';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { PermissionService } from '../../services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employeelist',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './employeelist.html',
  styleUrl: './employeelist.css',
})
export class Employeelistcomponent {
  private employeeService = inject(EmployeesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public permissionService = inject(PermissionService);
  employees = signal<any[]>([]);
  search: string = "";
  sort: string = "";
  page: number = 1;
  limit: number = 5;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadEmployees();
  }
  searchInput(values: string) {
    if (!values) {
      console.log("No search")
      return;
    }
    // const target = event.target as HTMLInputElement;
    this.search = values;
    this.page = 1;
    //console.log(this.search);
    this.loadEmployees();

  }
  onSortChange() {
    // console.log("called sort function");
    this.page = 1;
    this.loadEmployees();
  }
  previousPage() {
    if (this.page > 1) {

      this.page--;
      this.loadEmployees();
    }

  }
  nextPage() {
    if (this.page < this.totalPages) {

      this.page++;

      this.loadEmployees();

    }

  }
  loadEmployees(): void {
    this.employeeService.getEmployees(this.search, this.sort, this.page, this.limit).subscribe({
      next: (response: any) => {
        this.employees.set(response.data.data);
        console.log(this.employees());
        this.totalPages = response.data.totalPages;
        // this.totalPages = data.totalPages
      },
      error: (err: any) => console.error('Error fetching Employees:', err)
    });
  }
  // deleteEmployee(id: string) {
  //   this.employeeService.deleteEmployee(id).subscribe((res) => {
  //     console.log(id);
  //     this.loadCustomers();
  //   });
  // }
  updateEmployee(id: string) {
    if (!this.permissionService.hasPermission('employee.update')) {
      alert("You don't have permission.");
      return;
    }
    // console.log(id);
    this.router.navigate([`edit/${id}`]);
  }
  deleteEmployee(id: string) {
    // const confirmDelete = confirm("Are you sure you want to delete this employee?");
    // if (!confirmDelete) {
    //   return;
    // }
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "cancel",
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (!this.permissionService.hasPermission('employee.delete')) {
          alert("You don't have permission.");
          return;
        }
        this.employeeService.deleteEmployee(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Deleted!",
              text: "Employee deleted successfully.",
              icon: "success",
              //showConfirmButton: false
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Ok",
            })
            // console.log(id);
            this.loadEmployees();
          },
          error: (err: any) => {
            Swal.fire({
              title: "oops...",
              text: err.error.message,
              icon: "error",
              // confirmButtonColor: "#d33",
              //confirmButtonText: "Ok",
            })
            console.log(err);
          }
        });
      }
    })


  }

}
