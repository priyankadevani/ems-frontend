import { Routes } from '@angular/router';
import { RegisterComponent } from "../componets/register/register";
import { LoginComponent } from '../componets/login/login';
import { Employeelistcomponent } from '../componets/employeelist/employeelist';
import { CreateEmployee } from '../componets/create-employee/create-employee';
import { EditemployeeComponent } from '../componets/editemployee/editemployee';
import { RolelistComponent } from '../componets/rolelist/rolelist';
import { authGuard } from '../guards/auth-guard';
import { permissionGuard } from '../guards/permission-guard';
//import { roleGuard } from '../guards/role-guard';
import { EditRoleComponent } from '../componets/edit-role.component/edit-role.component';
import { Layout } from './layout/layout/layout';
import { employee } from '../models/employee.model';
import { CreateRole } from '../componets/create-role/create-role';
import { ListDepartment } from '../componets/list-department/list-department';
import { CreateDepartment } from '../componets/create-department/create-department';
import { EditDepartment } from '../componets/edit-department/edit-department';
import { ListDesignation } from '../componets/list-designation/list-designation';
import { CreateDesignation } from '../componets/create-designation/create-designation';
import { EditDesignation } from '../componets/edit-designation/edit-designation';
import { DashboardComponent } from '../componets/dashboard/dashboard';
import { Profile } from '../componets/profile/profile';
import { Attendancelist } from '../componets/attendancelist/attendancelist';
import { Attendanceteam } from '../componets/attendanceteam/attendanceteam';

export const routes: Routes = [
    // { path: "register", component: RegisterComponent },
    { path: "", component: LoginComponent },


    // {
    //     path: "employees", component: Employeelistcomponent, canActivate: [authGuard, permissionGuard], data: {
    //         permission: "employee.read"
    //     }
    // },

    {
        path: "",
        component: Layout,
        canActivate: [authGuard],
        children: [
            {
                path: "employees",
                component: Employeelistcomponent,
                canActivate: [permissionGuard],
                data: {
                    permission: "employee.read"
                }

            },
            {
                path: "create",
                component: CreateEmployee,
                canActivate: [permissionGuard],
                data: {
                    permission: "employee.create"
                }
            },
            {
                path: "edit/:id",
                component: EditemployeeComponent,
                canActivate: [permissionGuard],
                data: {
                    permission: "employee.update"
                }
            },
            {
                path: "roles",
                component: RolelistComponent,
                canActivate: [permissionGuard], data: {
                    permission: "role.read"
                }
            },
            {
                path: "roles/create",
                component: CreateRole,
                canActivate: [permissionGuard], data: {
                    permission: "role.create"
                }
            },
            {
                path: "roles/edit/:id",
                component: EditRoleComponent,
                canActivate: [permissionGuard], data: {
                    permission: "role.update"
                }
            },
            {
                path: 'departments',
                component: ListDepartment,
                canActivate: [authGuard, permissionGuard],
                data: {
                    permission: 'department.read'
                }
            },
            {
                path: "departments/create",
                component: CreateDepartment,
                canActivate: [permissionGuard],
                data: {
                    permission: "department.create"
                }
            },
            {
                path: "departments/edit/:id",
                component: EditDepartment,
                canActivate: [permissionGuard],
                data: {
                    permission: "department.update"
                }
            },
            {
                path: 'designations',
                component: ListDesignation,
                canActivate: [authGuard, permissionGuard],
                data: {
                    permission: 'designation.read'
                }
            },
            {
                path: "designations/create",
                component: CreateDesignation,
                canActivate: [permissionGuard],
                data: {
                    permission: "designation.create"
                }
            },
            {
                path: "designations/edit/:id",
                component: EditDesignation,
                canActivate: [permissionGuard],
                data: {
                    permission: "designation.update"
                }
            },
            {
                path: "dashboard",
                component: DashboardComponent
            },
            {
                path: "profile",
                component: Profile
            },
            {
                path: "attendance",
                component: Attendancelist,
                canActivate: [permissionGuard],
                data: {
                    permission: "attendance.self"
                }
            },
            {
                path: "attendance/team",
                component: Attendanceteam,
                canActivate: [permissionGuard],
                data: {
                    permission: "attendance.team",
                    attendanceScope: 'team'
                }
            },
            {
                path: "attendance/organization",
                component: Attendanceteam,
                canActivate: [permissionGuard],
                data: {
                    permission: "attendance.organization",
                    attendanceScope: 'organization'
                }
            }

        ]

    },
    // {
    //     path: "create", component: CreateEmployee, canActivate: [authGuard, permissionGuard], data: {
    //         permission: "employee.create"
    //     }
    // },
    // {
    //     path: "edit/:id", component: EditemployeeComponent, canActivate: [authGuard, permissionGuard], data: {
    //         permission: "employee.update"
    //     }
    // },

    // Admin-only route
    // {
    //     path: "roles",
    //     component: RolelistComponent,
    //     canActivate: [authGuard, permissionGuard], data: {
    //         permission: "role.read"
    //     }
    // },
    // {
    //     path: "roles/edit/:id",
    //     component: EditRoleComponent,
    //     canActivate: [authGuard, permissionGuard], data: {
    //         permission: "role.update"
    //     }
    // },

    { path: "**", component: LoginComponent, pathMatch: "full" }
];
