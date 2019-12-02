import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-selection-modal',
    templateUrl: './selection-modal.component.html',
    styleUrls: ['./selection-modal.component.scss'],
})
export class SelectionModalComponent implements OnInit {

    @Input() itemsCountChange: BehaviorSubject<number>;
    @Input() itemName: string = 'Item';

    itemsCount = 0;

    constructor(private controller: ActionSheetController) {
    }

    ngOnInit() {
        this.itemsCountChange.asObservable().subscribe(count => {
            this.itemsCount = count
        });
    }

    public deleteSelectedItems(): void {
        this.controller.create({
            header: this.getActionSheetHeader(),
            buttons: [
                {text: this.getDeleteButtonText(), role: 'destructive'},
                {text: 'Cancel', role: 'cancel'}
            ]
        }).then(actionSheet => {
            actionSheet.present();
        });
    }

    public getTitleMessage(): string {
        if (this.itemsCount === 0) {
            return `Select ${this.itemName}s`;
        } else if (this.itemsCount === 1) {
            return `1 ${this.itemName} Selected`;
        } else {
            return `${this.itemsCount} ${this.itemName}s Selected`;
        }
    }

    private getActionSheetHeader(): string {
        if (this.itemsCount <= 1) {
            return `This ${this.itemName.toLowerCase()} will be deleted on all your devices`;
        } else {
            return `These ${this.itemName.toLowerCase()}s will be deleted on all your devices`;
        }
    }

    private getDeleteButtonText(): string {
        if (this.itemsCount <= 1) {
            return `Delete ${this.itemsCount} ${this.itemName.toLowerCase()}`;
        } else {
            return `Delete ${this.itemsCount} ${this.itemName.toLowerCase()}s`;
        }
    }
}
