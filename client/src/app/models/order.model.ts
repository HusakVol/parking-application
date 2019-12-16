export interface Order {
    id?: number;
    title: string;
    description: string;
    initialPayment?: number;
    deadlineDate?: Date;
    startLocation: Coordinates;
    endLocation: Coordinates;
    isTracked?: boolean | false;

    type?: string;
    subTitle?: string;
    content?: string
}

export interface Coordinates {
    lng: number;
    lat: number;
}
