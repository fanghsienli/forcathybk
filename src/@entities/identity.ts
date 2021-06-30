export class AspNetUser {
    id: string;
    email: string;
    password: string;
    username: string;
    roles: AspNetUserRole[];
    constructor() {
        this.roles = new Array<AspNetUserRole>();
    }
}

export class AspNetUserRole {
    userId: string;
    roleId: string;
    value: string;
    constructor(userId: string, roleId: string) {
        this.userId = userId;
        this.roleId = roleId;
    }
}

export class AspNetRole {
    id: string;
    name: string;
    description: string;
    sort: number;

    constructor() {
    }
}

