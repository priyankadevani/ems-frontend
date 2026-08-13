export interface Profiledata {
    id: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    jiningDate: Date;
    salary: number;
    role: string;
    profileImage: {
        url: string;
        key: string;
    };
}