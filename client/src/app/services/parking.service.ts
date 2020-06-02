import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Parking } from '../models/parking.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    private apiUrl: string = `${environment.apiUrl}/api`;
    private _reloadParkings = new BehaviorSubject(null);

    public reloadParkings(): void {
        this._reloadParkings.next(true);
    }

    public getReloadParkingsObservable(): Observable<boolean> {
        return this._reloadParkings.asObservable();
    }

    constructor(private http: HttpClient) {
    }

    // GET
    public getParkingById(id: number): Observable<Parking> {
        return this.http.get<Parking>(`${this.apiUrl}/parkings/${id}`);
    }

    public getAllParkings(): Observable<Parking[]> {
        return this.http.get<Parking[]>(`${this.apiUrl}/parkings/active`);
    }

    // POST
    public park(parkingId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/parkings`, parkingId);
    }
}
