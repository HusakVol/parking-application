export interface Order {
    id?: number;
    title: string;
    description: string;
    initialPayment: number;
    deadlineDate: Date;
    startLocation: Coordinates;
    endLocation: Coordinates;
    driverId?: number;
}

export interface Coordinates {
    lng: number;
    lat: number;
}
