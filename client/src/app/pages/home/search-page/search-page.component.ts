import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { OrdersSegment, OrdersSegmentText } from '../../../constants/orders-segment.enum';
import { Order } from '../../../models/order.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
                result = this.searchedOrders.filter((o: Order) => o.type === OrdersSegment.ACTIVE_ORDERS);
                break;
            case OrdersSegment.PLANNED_ORDERS:
                result = this.searchedOrders.filter((o: Order) => o.type === OrdersSegment.PLANNED_ORDERS);
                break;
            case OrdersSegment.ARCHIVED_ORDERS:
                result = this.searchedOrders.filter((o: Order) => o.type === OrdersSegment.ARCHIVED_ORDERS);
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
        this.ordersService.getOrders().subscribe(res => {
            this.searchedOrders = res;
            event.target.complete();
        });
    }

    public onSearchInputChanged(event): void {
        const searchQuery = event.target.value;
        this.isLoading = true;
        this.ordersService.getOrdersBySearchQuery(searchQuery)
            .subscribe(orders => {
                this.searchedOrders = orders;
                this.isLoading = false;
            });
    }
}
