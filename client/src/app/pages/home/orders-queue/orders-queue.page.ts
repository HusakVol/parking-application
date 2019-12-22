import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-orders-queue',
    templateUrl: './orders-queue.page.html',
    styleUrls: ['./orders-queue.page.scss'],
})
export class OrdersQueuePage implements OnInit {
    public orders: Order[] = null;

    constructor(
        private ordersService: OrdersService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.getAssignedOrders();
        this.ordersService.getReloadOrdersObservable().subscribe(() => {
            this.orders = null;
            this.getAssignedOrders();
        });
    }

    public redirectToOrderPage(orderId: number): void {
        this.router.navigateByUrl(`/home/orders/${orderId}`);
    }

    public doRefresh(event): void {
        this.ordersService.getAssignedToDriverOrders().subscribe(orders => {
            this.orders = orders;
            event.target.complete();
        });
    }

    private getAssignedOrders(): void {
        this.ordersService.getAssignedToDriverOrders().subscribe(orders => this.orders = orders);
    }
}
