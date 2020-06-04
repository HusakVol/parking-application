import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Parking } from '../models/parking.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ParkingsService {

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

    public getParkingsBySearchQuery(query: string): Observable<Parking[]> {
        return this.http.get<Parking[]>(`${this.apiUrl}/parkings`, {params: {title: query}});
    }

    // GET
    public getParkingById(id: number): Observable<Parking> {
        return this.http.get<Parking>(`${this.apiUrl}/parkings/${id}`);
    }

    public getAllParkings(): Observable<Parking[]> {
        return this.http.get<Parking[]>(`${this.apiUrl}/parkings/all`);
    }

    public park(parkingId: number): Observable<void> {
        return this.http.get<void>(`${this.apiUrl}/parkings/${parkingId}/park`);
    }

    public unpark(parkingId: number): Observable<void> {
        return this.http.get<void>(`${this.apiUrl}/parkings/${parkingId}/unpark`);
    }
}
