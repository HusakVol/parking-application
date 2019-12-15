import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../models/order.model';
import * as moment from 'moment';
import { RoutingState } from '../../../utils/routing-state';

@Component({
    selector: 'app-order-creation',
    templateUrl: './order-creation.page.html',
    styleUrls: ['./order-creation.page.scss'],
})
export class OrderCreationPage implements OnInit {
    public form: FormGroup;

    public minDate = moment().add(1, 'd').format('YYYY-MM-DD');
    public maxDate = moment().add(2, 'y').format('YYYY-MM-DD');

    constructor(
        private fb: FormBuilder,
        private toastCtrl: ToastController,
        private ordersService: OrdersService,
        private routingState: RoutingState
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

        const order: Order = {
            title: this.form.controls.title.value,
            description: this.form.controls.description.value,
            initialPayment: this.form.controls.initialPayment.value,
            deadlineDate: this.buildDeadlineDate()
        };

        this.ordersService.createOrder(order).subscribe(() => {
            this.form.reset();
        });
    }

    public getPreviousUrl(): string {
        return this.routingState.getPreviousUrl();
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

    private buildDeadlineDate(): Date {
        const date = moment(this.form.controls.deadlineDate.value);
        const time = moment(this.form.controls.deadlineTime.value);

        return date
            .set('h', time.get('h'))
            .set('m', time.get('m'))
            .set('s', 0)
            .toDate();
    }
}
