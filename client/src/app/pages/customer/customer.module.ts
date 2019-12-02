import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPageRoutingModule } from './customer-routing.module';

import { CustomerPage } from './customer.page';
import { SelectionModalComponent } from '../../shared/selection-modal/selection-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomerPageRoutingModule
    ],
    declarations: [CustomerPage, SelectionModalComponent],
    entryComponents: [SelectionModalComponent]
})
export class CustomerPageModule {
}
