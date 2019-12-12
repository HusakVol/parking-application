export interface Order {
    id?: number;
    title: string;
    description: string;
    initialPayment?: number;
    deadlineDate?: Date;


    type?: string;
    subTitle?: string;
    content?: string
}
