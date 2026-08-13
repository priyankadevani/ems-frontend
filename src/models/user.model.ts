import { Permission } from "./permission.model";
import { Role } from "./role.model";

export interface User {

    id: string;

    email: string;

    role: Role;

    permissions: Permission[];

}