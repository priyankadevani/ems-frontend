import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Roleservice } from '../../services/roleservice';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-edit-role.component',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.css',
})
export class EditRoleComponent implements OnInit {
  private roleService = inject(Roleservice);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)
  public permissionService = inject(PermissionService)

  roleForm !: FormGroup;

  roles: any[] = [];
  permissions: any[] = [];
  selectedPermissonsIds: string[] = [];
  roleId!: string;
  groupedPermissions: { [key: string]: any[] } = {};

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    })

    this.roleId = this.route.snapshot.params['id'];
    this.loadpermissions();
    this.loadRole();
  }
  loadpermissions() {
    this.roleService.getpermissions().subscribe({
      next: (Response: any) => {
        this.permissions = Response.data;
        this.groupePermissions();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  loadRole() {

    this.roleService.getRoleById(this.roleId).subscribe({
      next: (Response: any) => {
        const role = Response.data.role;
        this.roleForm.patchValue({
          roleName: role.roleName
        })

        this.selectedPermissonsIds = role.permissions.map((p: any) => p._id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error)
      }
    })

  }
  groupePermissions() {
    this.groupedPermissions = {};

    this.permissions.forEach(permission => {

      const [module] = permission.name.split(".");

      if (module === "permission") {
        return;
      }

      if (!this.groupedPermissions[module]) {
        this.groupedPermissions[module] = [];
      }

      this.groupedPermissions[module].push(permission);

    });


  }
  onCheckboxChange(event: Event, permissionId: string) {
    const checkBox = event.target as HTMLInputElement;

    if (checkBox.checked) {
      this.selectedPermissonsIds.push(permissionId);
    } else {
      this.selectedPermissonsIds =
        this.selectedPermissonsIds.filter(id => id !== permissionId);

    }

  }
  isPermissionSelected(permissionId: string): boolean {

    return this.selectedPermissonsIds.includes(permissionId);

  }
  updateRole() {
    const data = this.roleForm.value;
    const payload = {
      roleName: data.roleName,
      permissions: this.selectedPermissonsIds,
    }
    this.roleService.updateRole(this.roleId, payload).subscribe({
      next: () => {
        this.router.navigate(['/roles'])
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


}
