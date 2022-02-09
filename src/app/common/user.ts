import { UserImages } from "./user-images";

export class User {
    username!: string;
    firstName!: string;
    lastName!: string;
    age!: number;
    gender!: string;
    selfSummary!: string;
    jobTitle!: string;
    company!: string;
    schoolName!: string;
    livingIn!: any;
    //imageData!: any;
    userImages!: UserImages[];
    conversationId!: number;
    matchedDate!: Date;
    sexuality!: string;

    /* constructor(username: string, firstName: string, lastName: string, age: number, gender: string, selfSummary: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.selfSummary = selfSummary;
    } */
}