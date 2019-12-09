export interface User {
    id: number,
    username: string,
    firstName: string;
    lastName: string;
    password: string,
    email: string,
    role: UserRole
}

export interface UserRole {
    CUSTOMER: 'CUSTOMER',
    DRIVER: 'DRIVER'
}
