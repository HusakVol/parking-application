import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
    public user: User = null;

    constructor(private authService: AuthService, private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();
    }

    public logout(): void {
        this.alertCtrl.create({
            header: 'Confirm',
            message: 'Are you sure you want to logout from current session?',
            buttons: [
                {text: 'Cancel'},
                {text: 'Logout', handler: () => this.authService.logout()}
            ]
        }).then(alert => alert.present());
    }
}
