import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roleservice } from '../../services/roleservice';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rolelist',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './rolelist.html',
  styleUrl: './rolelist.css',
})
export class RolelistComponent implements OnInit {
  private roleService = inject(Roleservice);
  roleForm!: FormGroup;
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(Router);
  public permissionService = inject(PermissionService)
  roles: any[] = [];
  permissions: any[] = [];
  selectedPermissionId: string[] = [];

  groupedPermissions: { [key: string]: any[] } = {};

  ngOnInit() {
    this.loadRoles();
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      // permissions: ['', Validators.required]
      // module: ['', Validators.required]
      // permissions: this.fb.group({
      //   manageEmployees: [false],
      //   manageRoles: [false],
      //   manageUsers: [false],
      //   manageProducts: [false],
      //   manageOrders: [false],
      //   managePayments: [false],
      //   manageShipments: [false],
      // })
    })
  }
  onCheckboxChange(event: Event, permissionId: string) {
    const checkEvent = event.target as HTMLInputElement;
    const isChecked = checkEvent.checked;

    if (isChecked) {
      this.selectedPermissionId.push(permissionId);
    } else {
      this.selectedPermissionId = this.selectedPermissionId.filter((id) => id != permissionId);

    }
  }
  createRole() {
    // if (this.roleForm.invalid) {
    //   return;
    // }
    const payLoad = {
      roleName: this.roleForm.value.roleName,
      permissions: this.selectedPermissionId
    }
    // console.log(payLoad);

    this.roleService.addrole(payLoad).subscribe({
      next: (data: any) => {
        console.log("role created :", data);
        this.roleForm.reset();
        this.selectedPermissionId = [];
        this.loadRoles();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadRoles() {
    this.roleService.getroles().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.roles = data.data.roles;
        console.log("Roles:", this.roles);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    }
    )
    this.roleService.getpermissions().subscribe({
      next: (data: any) => {
        // console.log("permission:", data);
        this.permissions = data.data;
        // for (let i = 0; i < data.data.length; i++) {
        //   this.permissions.push(data.data[i].);
        // }
        console.log("permission", this.permissions);
        this.groupPermissions();
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  groupPermissions() {

    this.groupedPermissions = {};

    this.permissions.forEach(permission => {

      const [module] = permission.name.split('.');
      if (module === 'permission') {
        return;
      }

      if (!this.groupedPermissions[module]) {
        this.groupedPermissions[module] = [];
      }

      this.groupedPermissions[module].push(permission);

    });

  }
  editRole(id: string) {
    this.route.navigate(["/roles/edit/", id]);
  }
  deleteRole(id: string) {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes,delete it!",
      cancelButtonColor: "#d33",
      cancelButtonText: "cancel"

    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(id).subscribe({
          next: (data: any) => {
            Swal.fire({
              title: "Deleted !",
              icon: "success",
              text: "Role deleted successfully",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK"
            })
            //console.log("role deleted :", data);
            this.loadRoles();
            this.cdr.detectChanges();
          },
          error: (error) => {
            Swal.fire({
              title: "oops...",
              icon: "error",
              text: "Role not deleted !",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK"
            })
            console.error(error);
          }
        })

      }
    })

  }
}
