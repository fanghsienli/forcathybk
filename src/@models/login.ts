export class RegisterModel {
    familyName: string;
    givenName: string;
    deviceName: string;
    userName: string;
    phone: string;
    email: string;
    password: string;
}

export class LoginModel {
    deviceName: string;
    userName: string;
    password: string;
}

export interface CurrentUserModel {
    userId: string;
    inventoryId: number;
    userName: string;
    roleName: string;
    token: string;
    roleId: string;
}