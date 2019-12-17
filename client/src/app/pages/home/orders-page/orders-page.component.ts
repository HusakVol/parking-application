import { Component, OnInit } from '@angular/core';
import { OrdersSegment } from '../../../constants/orders-segment.enum';
import { LoadingController, ModalController } from '@ionic/angular';
import { SelectionModalComponent } from '../../../shared/selection-modal/selection-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { Router } from '@angular/router';

@Component({
    selector: 'yx-customer-orders',
    templateUrl: 'orders-page.component.html',
    styleUrls: ['orders-page.component.scss']
})
export class OrdersPage implements OnInit {
    segments = OrdersSegment;
    selectedSegment: any = OrdersSegment.PLANNED_ORDERS;
    modal = null;

    selectedOrdersIds: number[] = [];
    orderSelectionSubject: BehaviorSubject<number>;

    orders: Order[] = null;

    isSelectionActive = false;

    constructor(
        public modalController: ModalController,
        public ordersService: OrdersService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {
        this.orderSelectionSubject = new BehaviorSubject(this.selectedOrdersIds.length);
    }

    ngOnInit(): void {
        this.ordersService.getPlannedOrders().subscribe(result => this.orders = result);
    }

    public redirectToOrderCreationPage(): void {
        this.router.navigate(['/home/create-order']);
    }

    public segmentChanged(event: CustomEvent): void {
        this.selectedSegment = OrdersSegment[event.detail.value];
        this.orders = null;

        switch (this.selectedSegment) {
            case OrdersSegment.ACTIVE_ORDERS:
                this.ordersService.getActiveOrders().subscribe(result => this.orders = result);
                break;
            case OrdersSegment.PLANNED_ORDERS:
                this.ordersService.getPlannedOrders().subscribe(result => this.orders = result);
                break;
            case OrdersSegment.ARCHIVED_ORDERS:
                this.ordersService.getArchivedOrders().subscribe(result => this.orders = result);
                break;
            default:
        }
    }

    public isAddOrderBtnVisible(): boolean {
        return !this.isSelectionActive;
    }

    public redirectToOrderPage(orderId: number): void {
        this.router.navigateByUrl(`/home/orders/${orderId}`);
    }

    public selectOrder(orderId: number): void {
        if (!this.isOrderSelected(orderId)) {
            this.selectedOrdersIds.push(orderId);
        } else {
            this.selectedOrdersIds = this.selectedOrdersIds.filter(id => id !== orderId);
        }

        this.orderSelectionSubject.next(this.selectedOrdersIds.length);
    }

    public changeSelectionStatus(): void {
        this.isSelectionActive = !this.isSelectionActive;

        if (this.isSelectionActive) {
            this.showSelectionModal();
        } else {
            this.dismissSelectionModal();
        }
    }

    public getOrderCardClass(orderId: number): string {
        const isOrderSelected = this.isOrderSelected(orderId);
        return this.isSelectionActive ?
            isOrderSelected ? 'card selected' : 'card unselected'
            : 'card';
    }

    public isOrderSelected(orderId: number): boolean {
        return this.selectedOrdersIds.includes(orderId);
    }

    private showSelectionModal(): void {
        this.modalController.create({
            component: SelectionModalComponent,
            cssClass: 'selection-modal',
            showBackdrop: false,
            componentProps: {
                'itemsCountChange': this.orderSelectionSubject,
                'itemName': 'Order',
                'onDelete': () => this.deleteSelectedOrders()
            },
        }).then(m => {
            m.present();
            this.modal = m;
        });
    }

    private dismissSelectionModal(): void {
        if (this.modal) {
            this.modal.dismiss().then(_ => {
                this.modal = null;
                this.selectedOrdersIds = [];
                this.orderSelectionSubject.next(this.selectedOrdersIds.length);
            });
        }
    }

    private deleteSelectedOrders(): void {
        this.loadingCtrl.create({message: 'Please wait...'})
            .then(ctrl => {
                ctrl.present();
                this.ordersService.deleteOrdersByIds(this.selectedOrdersIds).subscribe(() => {
                    this.ordersService.getPlannedOrders().subscribe(result => {
                        this.orders = result;
                        ctrl.dismiss().then();
                    });
                });
            });
    }
}
