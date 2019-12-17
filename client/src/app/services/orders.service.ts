import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    private apiUrl: string = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) {
    }

    // GET
    public getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }

    public getActiveOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/active`);
    }

    public getPlannedOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/planned`);
    }

    public getArchivedOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/archived`);
    }

    public getAssignedToDriverOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/assigned`);
    }

    public getOrdersBySearchQuery(query: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`, {params: {searchQuery: query}});
    }

    // DELETE
    public deleteOrdersByIds(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/orders`, {params: {ids: ids.join(',')}});
    }

    // POST
    public createOrder(order: Order): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/orders`, order);
    }

    public assignDriverToOrder(orderId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/orders/${orderId}/assignDriver`, {});
    }
}
