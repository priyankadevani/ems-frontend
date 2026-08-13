export interface EmployeeSummary {
    _id: string;
    firstName: string;
    lastName: string;
    joiningDate: string;
    profileImage?: { url: string };

    department: {
        name: string;
    };

    designation: {
        name: string;
    };
}

export interface Dashboard {

    totalEmployees: number;

    totalDesignations: number;

    totalDepartments: number;

    totalRoles: number;

    departmentChart: {
        _id: string;
        count: number;
    }[];

    employeeJoinedPerMonth: {
        _id: string;
        count: number;
    }[];

    recentEmployees: EmployeeSummary[];

}

