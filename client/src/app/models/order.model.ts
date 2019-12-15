export interface Order {
    id?: number;
    title: string;
    description: string;
    initialPayment?: number;
    deadlineDate?: Date;
    isTracked: boolean | false;

    type?: string;
    subTitle?: string;
    content?: string
}
