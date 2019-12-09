import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserProfilePage } from './user-profile.page';
import { UserProfilePageRoutingModule } from './user-profile-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserProfilePageRoutingModule
    ],
    declarations: [UserProfilePage]
})
export class UserProfilePageModule {
}
