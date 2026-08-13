import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Roleservice } from '../../services/roleservice';

@Component({
  selector: 'app-create-role',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './create-role.html',
  styleUrl: './create-role.css',
})
export class CreateRole implements OnInit {
  public permissionService = inject(PermissionService);
  private roleService = inject(Roleservice);
  private fb = inject(FormBuilder)
  roleForm!: FormGroup;
  private cdr = inject(ChangeDetectorRef);
  private route = inject(Router);
  roles: any[] = [];
  permissions: any[] = [];
  selectedPermissionId: string[] = [];
  groupedPermissions: { [key: string]: any[] } = {};
  serverError = signal('');

  ngOnInit(): void {
    this.loadRoles();
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
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
    this.serverError.set("");
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    const payLoad = {
      roleName: this.roleForm.value.roleName,
      permissions: this.selectedPermissionId
    }
    // console.log(payLoad);

    this.roleService.addrole(payLoad).subscribe({
      next: (data: any) => {
        //   console.log("role created :", data);
        this.roleForm.reset();
        this.selectedPermissionId = [];
        this.loadRoles();
        this.cdr.detectChanges();
        this.route.navigate(['roles']);
      },
      error: (error) => {
        console.log(error)
        this.serverError.set(error.error.message);
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
  loadRoles() {
    this.roleService.getroles().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.roles = data.data.roles;
        // console.log("Roles:", this.roles);
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
        //console.log("permission", this.permissions);
        this.groupPermissions();
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
