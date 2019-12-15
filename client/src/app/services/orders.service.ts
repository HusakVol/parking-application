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

    public getOrdersBySearchQuery(query: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`, {
            params: {searchQuery: query}
        });
    }

    public getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }

    public createOrder(order: Order): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/orders`, order);
    }

    public deleteOrdersByIds(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/orders`, {
            params: {
                orderIds: ids.join(',')
            }
        });
    }

    public getActiveOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }
}
