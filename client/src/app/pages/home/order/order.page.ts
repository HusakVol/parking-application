import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { RoutingState } from '../../../utils/routing-state';
import { getFormattedDate } from '../../../utils';

declare var google;

@Component({
    selector: 'app-order',
    templateUrl: './order.page.html',
    styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
    public order: Order;
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
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private routingState: RoutingState,
        private authService: AuthService,
        private loadingCtrl: LoadingController,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();

        const orderId = Number(this.route.snapshot.paramMap.get('id'));
        this.ordersService.getOrderById(orderId).subscribe(result => {
            this.order = result;
            this.isLoading = false;
        });
    }

    public isProcessOrderButtonVisible(): boolean {
        return this.user.role === 'DRIVER' && !this.order.driverId;
    }

    public processOrder(): void {
        this.showLoadingModal().then(() => {
            this.ordersService.assignDriverToOrder(this.order.id).subscribe(() => {
                this.loading.dismiss().then();
                this.ordersService.reloadOrders();
                this.router.navigateByUrl('/home/user-profile');
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
                            lng: parseFloat(this.order.startLocation.split(';')[0]),
                            lat: parseFloat(this.order.startLocation.split(';')[1])
                        },
                        zoom: 8
                    }
                );

                const startMarker = new google.maps.Marker({
                    map,
                    label: 'A',
                    animation: google.maps.Animation.DROP,
                    position: {
                        lng: parseFloat(this.order.startLocation.split(';')[0]),
                        lat: parseFloat(this.order.startLocation.split(';')[1])
                    }
                });

                const endMarker = new google.maps.Marker({
                    map,
                    label: 'B',
                    animation: google.maps.Animation.DROP,
                    position: {
                        lng: parseFloat(this.order.endLocation.split(';')[0]),
                        lat: parseFloat(this.order.endLocation.split(';')[1])
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
