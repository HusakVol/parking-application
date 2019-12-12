import { Component, OnInit } from '@angular/core';
import { HomeRouting } from '../../constants/home-routing.enum';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    public homeRouting = HomeRouting;
    public user: any = null;
    private currentUrl: string = null;

    constructor(private authService: AuthService, private router: Router) {
        this.listenRouterChanges();
    }

    ngOnInit() {
        this.user = this.authService.getUser();
    }

    public isTabsVisible(): boolean {
        const forbiddenRoutes = [`/home/${HomeRouting.CREATE_ORDER}`];
        return !forbiddenRoutes.includes(this.currentUrl);
    }

    private listenRouterChanges(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
            }
        });
    }
}
