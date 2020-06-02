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

    selectedParkingssIds: number[] = [];
    parkingSelectionSubject: BehaviorSubject<number>;

    orders: Order[] = null;

    isSelectionActive = false;

    constructor(
        public modalController: ModalController,
        public ordersService: OrdersService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {
        this.parkingSelectionSubject = new BehaviorSubject(this.selectedParkingssIds.length);
    }

    ngOnInit(): void {
        this.loadPlannedOrders();
        this.ordersService.getReloadOrdersObservable().subscribe(() => {
            this.orders = null;
            this.loadPlannedOrders();
        });
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

    public isAddParkingBtnVisible(): boolean {
        return !this.isSelectionActive;
    }

    public redirectToParkingPage(orderId: number): void {
        this.router.navigateByUrl(`/home/orders/${orderId}`);
    }

    public selectParking(parkingId: number): void {
        if (!this.isParkingSelected(parkingId)) {
            this.selectedParkingssIds.push(parkingId);
        } else {
            this.selectedParkingssIds = this.selectedParkingssIds.filter(id => id !== parkingId);
        }

        this.parkingSelectionSubject.next(this.selectedParkingssIds.length);
    }

    public changeSelectionStatus(): void {
        this.isSelectionActive = !this.isSelectionActive;

        if (this.isSelectionActive) {
            this.showSelectionModal();
        } else {
            this.dismissSelectionModal();
        }
    }

    public getParkingCardClass(parkingId: number): string {
        const isParkingSelected = this.isParkingSelected(parkingId);
        return this.isSelectionActive ?
            isParkingSelected ? 'card selected' : 'card unselected'
            : 'card';
    }

    public isParkingSelected(parkingId: number): boolean {
        return this.selectedParkingssIds.includes(parkingId);
    }

    private showSelectionModal(): void {
        this.modalController.create({
            component: SelectionModalComponent,
            cssClass: 'selection-modal',
            showBackdrop: false,
            componentProps: {
                'itemsCountChange': this.parkingSelectionSubject,
                'itemName': 'Parking'
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
                this.selectedParkingssIds = [];
                this.parkingSelectionSubject.next(this.selectedParkingssIds.length);
            });
        }
    }

    private loadPlannedOrders(): void {
        this.ordersService.getPlannedOrders().subscribe(result => this.orders = result);
    }
}
