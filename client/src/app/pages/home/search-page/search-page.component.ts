import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../models/order.model';
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
    public searchedOrders: Order[] = [];

    private searchQuery: string = '';

    constructor(
        private ordersService: OrdersService,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        this.authService.onUserChanged().subscribe(() => this.currentUser = this.authService.getUser());

        this.isLoading = true;
        this.ordersService.getOrdersBySearchQuery(this.searchQuery).subscribe(orders => {
            this.searchedOrders = orders;
            this.isLoading = false;
        });
    }

    public getOrderStatusBadgeColor(id: number): string {
        const order = this.searchedOrders.find(o => o.id === id);
        if (!order) return 'primary';

        if (!!order.driverId) return 'success';
        if (moment(order.deadlineDate).isBefore(now())) return 'danger';
        if (moment(order.deadlineDate).isAfter(now())) return 'warning';

        return 'primary';
    }

    public redirectToOrderPage(orderId: number): void {
        this.router.navigateByUrl(`/home/orders/${orderId}`);
    }

    public onSearchInputChanged(event): void {
        this.searchQuery = event.target.value;
        this.isLoading = true;
        this.ordersService.getOrdersBySearchQuery(this.searchQuery)
            .subscribe(orders => {
                this.searchedOrders = orders;
                this.isLoading = false;
            });
    }
}
