import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    apiUrl: string = 'https://my-json-server.typicode.com/unrenamed/yarik-express-db-fake';

    constructor(private http: HttpClient) {
    }

    public getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    public createOrder(order: Order): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/orders`, order);
    }
}
