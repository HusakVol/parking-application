import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-order-creation',
    templateUrl: './order-creation.page.html',
    styleUrls: ['./order-creation.page.scss'],
})
export class OrderCreationPage implements OnInit {
    public form: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.initFormBuilder();
    }

    public processForm(): void {
        if (this.form.valid) {
            const order = {
                title: this.form.controls.title,
                description: this.form.controls.description,
            };
            console.log(order);
        }
    }

    private initFormBuilder(): void {
        this.form = this.fb.group({
            title: ['', Validators.compose([
                Validators.maxLength(100),
                Validators.minLength(5),
                Validators.required])
            ],
            description: ['', Validators.compose([
                Validators.maxLength(240),
                Validators.minLength(10),
                Validators.required])
            ]
        });
    }
}
