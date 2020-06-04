import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import { User } from '../../../models/user.model';
import {Router} from "@angular/router";
import { ParkingsService } from '../../../services/parking.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
    public user: User = null;
    private router: Router
    private loadingCtrl: LoadingController
    private parkingService:ParkingsService
    private loading: any = null;



    constructor(private authService: AuthService, private alertCtrl: AlertController, private parkingsService: ParkingsService) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        this.authService.onUserChanged().subscribe(() => this.user = this.authService.getUser());
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

    public redirectToParkingPage(parkingId: number): void {
        this.router.navigateByUrl(`/home/parkings/${parkingId}`);
    }

    private async showLoadingModal(): Promise<void> {
        this.loading = await this.loadingCtrl.create({message: 'Please wait...'});
        await this.loading.present();
    }

    public processParking(): void {

            this.parkingService.unpark(this.user.parking.id).subscribe(() => {
                this.loading.dismiss().then();
                this.authService.getUser().parking = null
                this.router.navigateByUrl('/home/my-profile');
            });

    }


    public getParkingStatusBadgeColor(id: number): string {
        const parking = this.user.parking;
        if (!parking) return 'primary';

        if (parking.freePlaces < parking.capacity*.75) return 'success';
        if (parking.freePlaces <= parking.capacity && parking.freePlaces >= parking.capacity*.75) return 'danger';
        if (parking.freePlaces == parking.capacity) return 'warning';

        return 'primary';
    }
}
