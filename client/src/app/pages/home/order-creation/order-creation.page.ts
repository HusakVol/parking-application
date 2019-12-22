import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { OrdersService } from '../../../services/orders.service';
import * as moment from 'moment';
import { RoutingState } from '../../../utils/routing-state';
import { Order } from '../../../models/order.model';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
    selector: 'app-order-creation',
    templateUrl: './order-creation.page.html',
    styleUrls: ['./order-creation.page.scss'],
})
export class OrderCreationPage implements OnInit {

    public map: any;
    public orderStartLocationMarker: any;
    public orderEndLocationMarker: any;

    public form: FormGroup;
    public isLocationView = false;

    public minDate = moment().add(1, 'd').format('YYYY-MM-DD');
    public maxDate = moment().add(2, 'y').format('YYYY-MM-DD');

    private mapElement: ElementRef;

    @ViewChild('map', {static: false}) set content(map: ElementRef) {
        this.mapElement = map;
    }

    constructor(
        private fb: FormBuilder,
        private toastCtrl: ToastController,
        private ordersService: OrdersService,
        private routingState: RoutingState,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private router: Router,
        private geolocation: Geolocation
    ) {
    }

    ngOnInit() {
        this.initFormBuilder();
    }

    public processForm(): void {
        if (!this.form.valid) {
            this.toastCtrl.create({
                header: 'Order creation failed',
                message: 'Please specify all required fields.',
                color: 'danger',
                duration: 1200
            }).then(toast => toast.present());
            return;
        }

        this.alertCtrl.create({
            header: 'Location setup',
            message: 'Please, specify where order should be picked up (A marker) and where it should be taken (B marker).',
            buttons: [{text: 'Got it!', handler: () => this.setupMaps()}]
        }).then(alert => alert.present());
    }

    public getPreviousUrl(): string {
        return this.routingState.getPreviousUrl();
    }

    public createOrder(): void {
        this.loadingCtrl.create({message: 'Creating order...'})
            .then(loading => {
                loading.present();

                const startLocation = `${this.orderStartLocationMarker.getPosition().lng()};${this.orderStartLocationMarker.getPosition().lat()}`;
                const endLocation = `${this.orderEndLocationMarker.getPosition().lng()};${this.orderEndLocationMarker.getPosition().lat()}`;

                const order: Order = {
                    title: this.form.controls.title.value,
                    description: this.form.controls.description.value,
                    initialPayment: this.form.controls.initialPayment.value,
                    deadlineDate: this.buildDeadlineDate(),
                    startLocation,
                    endLocation
                };

                this.ordersService.createOrder(order).subscribe(() => {
                    loading.dismiss().then();
                    this.toastCtrl.create({
                        header: 'Order was successfully created',
                        color: 'success',
                        duration: 1000
                    }).then(toast => {
                        toast.present();
                        this.clearAndCloseForm();
                    });

                });
            });
    }

    public closeForm(): void {
        this.alertCtrl.create({
            header: 'Confirm',
            message: 'Are you sure you want to cancel order creation process?',
            buttons: [
                {text: 'No'},
                {text: 'Yes', handler: () => this.clearAndCloseForm()}
            ]
        }).then(alert => alert.present());
    }

    private initFormBuilder(): void {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            initialPayment: [null, Validators.required],
            deadlineDate: [null, Validators.required],
            deadlineTime: [null, Validators.required]
        });
    }

    private clearAndCloseForm(): void {
        this.form.reset();
        this.isLocationView = false;
        this.ordersService.reloadOrders();
        this.router.navigateByUrl('/home/my-orders');
    }

    private setupMaps(): void {
        this.isLocationView = true;

        this.geolocation.getCurrentPosition().then(res => {
            this.map = this.getMapConfig({
                lat: res.coords.latitude,
                lng: res.coords.longitude
            });

            this.orderStartLocationMarker = this.getMarkerConfig({
                label: 'A',
                lat: res.coords.latitude,
                lng: res.coords.longitude
            });
            this.orderStartLocationMarker.addListener('click', () => this.toggleBounce(this.orderStartLocationMarker));

            this.orderEndLocationMarker = this.getMarkerConfig({
                label: 'B',
                lat: res.coords.latitude,
                lng: res.coords.longitude + 0.005
            });
            this.orderEndLocationMarker.addListener('click', () => this.toggleBounce(this.orderEndLocationMarker));

        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    private buildDeadlineDate(): Date {
        const date = moment(this.form.controls.deadlineDate.value);
        const time = moment(this.form.controls.deadlineTime.value);

        return date
            .set('h', time.get('h'))
            .set('m', time.get('m'))
            .set('s', 0)
            .toDate();
    }

    private toggleBounce(marker: any): void {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    private getMapConfig({lat, lng}): object {
        return new google.maps.Map(
            this.mapElement.nativeElement,
            {
                center: {lat, lng},
                zoom: 12
            }
        );
    }

    private getMarkerConfig({label, lat, lng}): object {
        return new google.maps.Marker({
            map: this.map,
            draggable: true,
            label,
            animation: google.maps.Animation.DROP,
            position: {lat, lng}
        });
    }
}
