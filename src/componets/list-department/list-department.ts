import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { PermissionService } from '../../services/permission.service';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-department',
  imports: [CommonModule, RouterLink, MatButton, FormsModule

  ],
  templateUrl: './list-department.html',
  styleUrl: './list-department.css',
})
export class ListDepartment implements OnInit {
  private Router = inject(Router);
  public departmentService = inject(DepartmentService);
  public permissionService = inject(PermissionService);

  departments = signal<any[]>([]);
  search: string = "";
  sort: string = "";
  page: number = 1;
  limit: number = 5;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadDepartments();
  }
  searchInput(values: string) {
    if (!values) {
      this.search = "";
      this.page = 1;
      this.loadDepartments();
      return;
    }
    this.search = values;
    this.page = 1;
    this.loadDepartments();

  }
  onSortChange() {
    // console.log("called sort function");
    this.page = 1;
    this.loadDepartments();
  }
  previousPage() {
    if (this.page > 1) {

      this.page--;
      this.loadDepartments();
    }

  }
  nextPage() {
    if (this.page < this.totalPages) {

      this.page++;

      this.loadDepartments();

    }
  }
  loadDepartments() {
    this.departmentService.getDepartments(this.search, this.sort, this.page, this.limit).subscribe({
      next: (response: any) => {
        //  console.log(response);
        this.departments.set(response.data.data);
        this.totalPages = response.data.totalPages;
      },
      error: (err: any) => console.error('Error fetching Departments:', err)
    });
  }
  editDepartment(id: any) {
    if (!this.permissionService.hasPermission('department.update')) {
      alert("You don't have permission.");
      return;
    }
    this.Router.navigate([`departments/edit/${id}`]);

  }
  deleteDepartment(id: any) {
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
        if (!this.permissionService.hasPermission('department.delete')) {
          alert("You don't have permission.");
          return;
        }
        this.departmentService.deleteDepartment(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Deleted!",
              text: "Department deleted successfully.",
              icon: "success",
              //showConfirmButton: false
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Ok",
            })
            // console.log(id);
            this.loadDepartments();
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
