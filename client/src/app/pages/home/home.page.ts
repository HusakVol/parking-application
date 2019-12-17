import { Component, OnInit } from '@angular/core';
import { HomeRouting } from '../../constants/home-routing.enum';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { HomeTab, HomeTabs } from '../../models/home-tab.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    public user: any = null;
    private currentUrl: string = '';

    constructor(private authService: AuthService, private router: Router) {
        this.listenRouterChanges();
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        this.authService.onUserChanged().subscribe(() => this.user = this.authService.getUser());
    }

    public isTabsVisible(): boolean {
        const forbiddenRoutes = [
            `/home/${HomeRouting.CREATE_ORDER}`,
            `/home/orders/`,
        ];

        return !forbiddenRoutes.find(r => this.currentUrl.includes(r));
    }

    public getHomeTabs(): HomeTab[] {
        const currentUserRole = this.user.role;
        switch (currentUserRole) {
            case 'DRIVER':
                return HomeTabs.DRIVER;
            case 'CUSTOMER':
                return HomeTabs.CUSTOMER;
            default:
                return [];
        }
    }

    private listenRouterChanges(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
            }
        });
    }
}
