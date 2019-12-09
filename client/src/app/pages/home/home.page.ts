import { Component, OnInit } from '@angular/core';
import { HomeRouting } from '../../constants/home-routing.enum';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    public homeRouting = HomeRouting;
    public user: any = null;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();
    }
}
