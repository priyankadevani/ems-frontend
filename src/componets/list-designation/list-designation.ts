import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { DesignationService } from '../../services/designation.service';
import { PermissionService } from '../../services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-designation',
  imports: [CommonModule, RouterLink, MatButton, FormsModule],
  templateUrl: './list-designation.html',
  styleUrl: './list-designation.css',
})
export class ListDesignation implements OnInit {
  private Router = inject(Router);
  public designationService = inject(DesignationService);
  public permissionService = inject(PermissionService);

  designations = signal<any[]>([]);


  search: string = "";
  sort: string = "";
  page: number = 1;
  limit: number = 5;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadDesignations();
  }
  searchInput(values: string) {
    if (!values) {
      this.search = "";
      this.page = 1;
      this.loadDesignations();
      return;
    }
    this.search = values;
    this.page = 1;
    this.loadDesignations();

  }
  onSortChange() {
    // console.log("called sort function");
    this.page = 1;
    this.loadDesignations();
  }
  previousPage() {
    if (this.page > 1) {

      this.page--;
      this.loadDesignations();
    }

  }
  nextPage() {
    if (this.page < this.totalPages) {

      this.page++;

      this.loadDesignations();

    } this.loadDesignations();
  }
  loadDesignations() {
    this.designationService.getDesignations(this.search, this.sort, this.page, this.limit).subscribe({
      next: (response: any) => {
        //  console.log(response);
        this.designations.set(response.data.data);
        this.totalPages = response.data.totalPages;
      },
      error: (err: any) => console.error('Error fetching Departments:', err)
    });
  }
  editDesignation(id: any) {
    if (!this.permissionService.hasPermission('designation.update')) {
      alert("You don't have permission.");
      return;
    }
    this.Router.navigate([`designations/edit/${id}`]);

  }
  deleteDesignation(id: any) {
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
        if (!this.permissionService.hasPermission('designation.delete')) {
          alert("You don't have permission.");
          return;
        }
        this.designationService.deleteDesignation(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Deleted!",
              text: "Designation deleted successfully.",
              icon: "success",
              //showConfirmButton: false
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Ok",
            })
            // console.log(id);
            this.loadDesignations();
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





