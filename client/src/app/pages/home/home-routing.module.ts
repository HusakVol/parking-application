import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { HomeRouting } from '../../constants/home-routing.enum';

const routes: Routes = [
    {
        path: 'home',
        component: HomePage,
        children: [
            {
                path: HomeRouting.MY_PROFILE,
                loadChildren: () => import('./user-profile/user-profile.module')
                    .then(m => m.UserProfilePageModule)
            },
            {
                path: HomeRouting.PARKING,
                loadChildren: () => import('./parking/pakring.module')
                    .then(m => m.ParkingPageModule)
            },
            {
                path: HomeRouting.MY_Parkings,
                loadChildren: () => import('./parkings-page/parkings-page.module')
                    .then(m => m.ParkingsPageModule)
            },
            {
                path: HomeRouting.SEARCH,
                loadChildren: () => import('./search-page/search-page.module')
                    .then(m => m.SearchPageModule)
            },
            {
                path: '',
                redirectTo: `/home/${HomeRouting.MY_PROFILE}`,
                pathMatch: 'full'
            }
        ],
    },
    {
        path: '',
        redirectTo: `/home/${HomeRouting.MY_PROFILE}`,
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {
}
