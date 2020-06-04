import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Parking } from '../../../models/parking.model';
import { ParkingsService } from '../../../services/parking.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { RoutingState } from '../../../utils/routing-state';
import { getFormattedDate } from '../../../utils';

declare var google;

@Component({
    selector: 'app-parking',
    templateUrl: './parking.page.html',
    styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {
    public parking: Parking;
    public user: any = null;
    public isLoading = true;
    public now = moment();
    public isMapView = false;

    private loading: any = null;
    private mapElement: ElementRef;

    @ViewChild('map', {static: false}) set content(map: ElementRef) {
        this.mapElement = map;
    }

    constructor(
        private parkingsService: ParkingsService,
        private route: ActivatedRoute,
        private routingState: RoutingState,
        private authService: AuthService,
        private loadingCtrl: LoadingController,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();

        const parkingId = Number(this.route.snapshot.paramMap.get('id'));
        this.parkingsService.getParkingById(parkingId).subscribe(result => {
            this.parking = result;
            this.isLoading = false;
        });
    }

    // public isProcessOrderButtonVisible(): boolean {
    //     return this.user.role === 'DRIVER' && !this.parking.driverId;
    // }

    public processParking(): void {
        this.showLoadingModal().then(() => {
            this.parkingsService.park(this.parking.id).subscribe(() => {
                this.loading.dismiss().then();
                if (!this.authService.getUser().parking)
                    this.authService.getUser().parking = this.parking
                else
                    this.authService.getUser().parking = null
                this.router.navigateByUrl('/home/my-profile');
            });
        })
    }

    public getPreviousUrl(): string {
        return this.routingState.getPreviousUrl();
    }

    public getFormattedDate(date: Date): string {
        return getFormattedDate(date);
    }

    public segmentChanged(event: CustomEvent): void {
        const segment = event.detail.value;
        this.isMapView = segment === 'map';

        if (this.isMapView) {
            setTimeout(() => {
                const map = new google.maps.Map(
                    this.mapElement.nativeElement,
                    {
                        center: {
                            lng: parseFloat(this.parking.location.split(';')[0]),
                            lat: parseFloat(this.parking.location.split(';')[1])
                        },
                        zoom: 8
                    }
                );
                const endMarker = new google.maps.Marker({
                    map,
                    label: 'B',
                    animation: google.maps.Animation.DROP,
                    position: {
                        lng: parseFloat(this.parking.location.split(';')[0]),
                        lat: parseFloat(this.parking.location.split(';')[1])
                    }
                });
            }, 1);
        }
    }

    private async showLoadingModal(): Promise<void> {
        this.loading = await this.loadingCtrl.create({message: 'Please wait...'});
        await this.loading.present();
    }
}
