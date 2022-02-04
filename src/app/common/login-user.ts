import { User } from "./user";

export class LoginUser {
    emailId!: string;
    username!: string;
    password!: string;
    basicUserDetails!: User

    constructor(emaiId: string, username: string, password: string, basicUserDetails: User) {
        this.emailId = emaiId;
        this.username = username; 
        this.password = password;
        this.basicUserDetails = basicUserDetails;
    }
}
