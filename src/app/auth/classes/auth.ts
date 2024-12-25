import { EventEmitter } from "@angular/core";     
import { IUser } from "../models/user";

export class Auth {
    static userEmitter = new EventEmitter<IUser>();
}