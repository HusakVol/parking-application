import { Component, OnInit } from '@angular/core';
import { OrdersSegment } from '../../../constants/orders-segment.enum';
import { ModalController } from '@ionic/angular';
import { SelectionModalComponent } from '../../../shared/selection-modal/selection-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';

@Component({
    selector: 'yx-customer-orders',
    templateUrl: 'orders-page.component.html',
    styleUrls: ['orders-page.component.scss']
})
export class OrdersPage implements OnInit {
    segments = OrdersSegment;
    modal = null;

    selectedOrdersIds: number[] = [];
    orderSelectionSubject: BehaviorSubject<number>;

    orders: Order[] = null;

    isSelectionActive = false;

    constructor(
        public modalController: ModalController,
        public ordersService: OrdersService
    ) {
        this.orderSelectionSubject = new BehaviorSubject(this.selectedOrdersIds.length);
    }

    ngOnInit(): void {
        this.ordersService.getOrders().subscribe(result => this.orders = result);
    }

    public segmentChanged(event: CustomEvent): void {
        const segment = event.detail.value;
        console.log(segment);
    }

    public isAddOrderBtnVisible(): boolean {
        return !this.isSelectionActive;
    }

    public selectOrder(event: CustomEvent, orderId: number): void {
        const isSelected = event.detail.checked;

        if (isSelected) {
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

    private showSelectionModal(): void {
        this.modalController.create({
            component: SelectionModalComponent,
            cssClass: 'selection-modal',
            showBackdrop: false,
            componentProps: {
                'itemsCountChange': this.orderSelectionSubject,
                'itemName': 'Order'
            }
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
}
