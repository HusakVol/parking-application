import { Component, OnInit } from '@angular/core';
import { ParkingsService } from '../../../services/parking.service';
import { Parking } from '../../../models/parking.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { now } from 'moment';

@Component({
    selector: 'yx-customer-search',
    templateUrl: 'search-page.component.html',
    styleUrls: ['search-page.component.scss']
})
export class SearchPage implements OnInit {

    public isLoading = false;
    public currentUser: any = null;
    public searchedParkings: Parking[] = [];

    private searchQuery: string = '';

    constructor(
        private ordersService: ParkingsService,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        this.authService.onUserChanged().subscribe(() => this.currentUser = this.authService.getUser());

        this.isLoading = true;
        this.ordersService.getParkingsBySearchQuery(this.searchQuery).subscribe(orders => {
            this.searchedParkings = orders;
            this.isLoading = false;
        });
    }
    public calculateDistance(coordinates: string): number {
        var lat1 = Number.parseFloat(coordinates.split(';')[0])
        var lon1 = Number.parseFloat(coordinates.split(';')[1])
        var lat2 = 21.013141
        var lon2 = 52.222782
        const R = 6371e3; // metres
        const f1 = lat1 * Math.PI/180; // φ, λ in radians
        const f2 = lat2 * Math.PI/180;
        const df = (lat2-lat1) * Math.PI/180;
        const da = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(df/2) * Math.sin(df/2) +
            Math.cos(f1) * Math.cos(f2) *
            Math.sin(da/2) * Math.sin(da/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return Math.floor(R * c * 1.2);
    }

    public getParkingStatusBadgeColor(id: number): string {
        const parking = this.searchedParkings.find(o => o.id === id);
        if (!parking) return 'primary';

        if (parking.freePlaces < parking.capacity*.75) return 'success';
        if (parking.freePlaces <= parking.capacity && parking.freePlaces >= parking.capacity*.75) return 'danger';
        if (parking.freePlaces == parking.capacity) return 'warning';

        return 'primary';
    }

    public redirectToParkingPage(parkingId: number): void {
        this.router.navigateByUrl(`/home/parkings/${parkingId}`);
    }

    public onSearchInputChanged(event): void {
        this.searchQuery = event.target.value;
        this.isLoading = true;
        this.ordersService.getParkingsBySearchQuery(this.searchQuery)
            .subscribe(orders => {
                this.searchedParkings = orders;
                this.isLoading = false;
            });
    }
}
