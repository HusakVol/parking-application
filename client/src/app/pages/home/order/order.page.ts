import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { RoutingState } from '../../../utils/routing-state';

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

    private loading: any = null;

    constructor(
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private routingState: RoutingState,
        private authService: AuthService,
        private loadingCtrl: LoadingController
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
        return this.user.role === 'DRIVER';
    }

    public processOrder(): void {
        this.showLoadingModal().then(() => {
            // TODO: logic to process order for driver
            this.loading.dismiss().then();
        })
    }

    public getPreviousUrl(): string {
        return this.routingState.getPreviousUrl();
    }

    private async showLoadingModal(): Promise<void> {
        this.loading = await this.loadingCtrl.create({message: 'Please wait...'});
        await this.loading.present();
    }
}
