import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissions = signal<string[]>([]);

  setPermissions(permissionList: { name: string }[]) {

    this.permissions.set(

      permissionList.map(permission => permission.name)

    );

  }

  hasPermission(permission: string): boolean {
    // console.log(
    //   "Checking:",
    //   permission,
    //   "Available permissions:",
    //   this.permissions()
    // );

    return this.permissions().includes(permission);

  }

  clear() {

    this.permissions.set([]);

  }



}
