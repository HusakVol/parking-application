export interface Order {
    id?: number;
    title: string;
    description: string;
    initialPayment: number;
    deadlineDate: Date;
    startLocation: string;
    endLocation: string;
    driverId?: number;
}

export interface Coordinates {
    lng: number;
    lat: number;
}
