import { User } from "./user.model";

export interface LoginResponse {

    success: boolean;

    message: string;

    data: {

        user: {
            id: string,
            email: string,
            firstName: string,
            lastName: string,
            profileImage: {
                url: string,
                key: string
            },
            role: {
                id: string,
                roleName: string,
            },
            permissions: string[]
        };


    };

}