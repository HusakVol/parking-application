import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage {
    private credentials = {
        username: null,
        password: null
    };
    private toast: any = null;
    private loading: any = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) {
    }

    public login(): void {
        this.dismissToastIfExists();

        this.validateCredentials().then(async isValid => {
            if (!isValid) return;

            this.loading = await this.loadingCtrl.create({message: 'Please wait...'});
            await this.loading.present();

            this.authService.login(this.credentials).subscribe(async res => {
                this.loading.dismiss().then();

                if (res) {
                    switch (this.authService.getUser().role) {
                        case 'CUSTOMER':
                            this.router.navigateByUrl('/home/my-orders');
                            break;
                        case 'DRIVER':
                            this.router.navigateByUrl('/tracking');
                            break;
                        default:
                            this.router.navigateByUrl('/');
                            break;
                    }
                } else {
                    this.toast = await this.toastCtrl.create({
                        header: 'Login Failed',
                        message: 'Wrong login credentials.',
                        color: 'danger',
                        duration: 2000
                    });
                    await this.toast.present();
                }
            });
        });
    }

    public updateUsername(event: CustomEvent): void {
        this.credentials.username = event.detail.value;
    }

    public updatePassword(event: CustomEvent): void {
        this.credentials.password = event.detail.value;
    }

    private async validateCredentials(): Promise<boolean> {
        const {username, password} = this.credentials;

        if (!username || (username && !username.length) || !password || (password && !password.length)) {
            this.toast = await this.toastCtrl
                .create({
                    header: 'Login Failed',
                    message: 'Please, specify login credentials.',
                    color: 'danger',
                    duration: 2000
                });
            this.toast.present();
            return false;
        }

        return true;
    }

    private dismissToastIfExists(): void {
        if (this.toast)
            this.toast.dismiss().then();
    }
}
