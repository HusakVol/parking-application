import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { OrdersSegment, OrdersSegmentText } from '../../../constants/orders-segment.enum';
import { Order } from '../../../models/order.model';

@Component({
    selector: 'yx-customer-search',
    templateUrl: 'search-page.component.html',
    styleUrls: ['search-page.component.scss']
})
export class SearchPage implements OnInit {
    searchedOrders: Order[] = [];
    segments = Object.keys(OrdersSegment);
    segmentText = OrdersSegmentText;

    isLoading = true;

    constructor(private ordersService: OrdersService) {
    }

    ngOnInit(): void {
        this.ordersService.getOrders().subscribe(res => {
            this.searchedOrders = res;
            this.isLoading = false;
        });
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
}
