import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    selectedRole = 'admin';

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    public roleChanged(event): void {
        this.selectedRole = event.detail.value;
    }

    public redirectToNextPage(): void {
        this.router.navigate([`/${this.selectedRole}`]);
    }
}
