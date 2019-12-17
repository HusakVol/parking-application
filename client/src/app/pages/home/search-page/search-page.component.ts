import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { OrdersSegment, OrdersSegmentText } from '../../../constants/orders-segment.enum';
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

    public segments = Object.keys(OrdersSegment);
    public segmentText = OrdersSegmentText;
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
    }

    public getOrdersByGivenSegment(segment): Order[] {
        let result: Order[] = [];

        switch (OrdersSegment[segment]) {
            case OrdersSegment.ACTIVE_ORDERS:
                result = this.searchedOrders.filter((o: Order) => !!o.driverId);
                break;
            case OrdersSegment.PLANNED_ORDERS:
                result = this.searchedOrders.filter((o: Order) => moment(o.deadlineDate).isAfter(now()));
                break;
            case OrdersSegment.ARCHIVED_ORDERS:
                result = this.searchedOrders.filter((o: Order) => moment(o.deadlineDate).isBefore(now()));
                break;
            default:
                result = [];
        }

        return result;
    }

    public getBadgeColorByOrderType(type: string): string {
        switch (type) {
            case OrdersSegment.ACTIVE_ORDERS:
                return 'success';
            case OrdersSegment.PLANNED_ORDERS:
                return 'warning';
            case OrdersSegment.ARCHIVED_ORDERS:
                return 'danger';
            default:
                return 'primary';
        }
    }

    public redirectToOrderPage(orderId: number): void {
        this.router.navigateByUrl(`/home/orders/${orderId}`);
    }

    public doRefresh(event): void {
        this.ordersService.getOrdersBySearchQuery(this.searchQuery)
            .subscribe(orders => {
                this.searchedOrders = orders;
                event.target.complete();
            });
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
