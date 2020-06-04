import {Parking} from "./parking.model";

export interface User {
    id: number,
    username: string,
    firstName: string;
    lastName: string;
    password: string,
    email: string,
    parking: Parking
}
