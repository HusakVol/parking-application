import {User} from "./user.model";

export interface Parking {
    id?: number;
    title: string;
    description: string;
    pricePerHour: number;
    capacity: number;
    freePlaces: number;
    location: string;
    users: Array<User>
}