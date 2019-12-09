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
                loadChildren: () =>
                    import('./user-profile/user-profile.module')
                        .then(m => m.UserProfilePageModule)
            },
            {
                path: HomeRouting.MY_ORDERS,
                loadChildren: () => import('./orders-page/orders-page.module')
                    .then(m => m.OrdersPageModule)
            },
            {
                path: HomeRouting.CREATE_ORDER,
                loadChildren: () => import('./order-creation/order-creation.module')
                    .then(m => m.OrderCreationPageModule)
            },
            {
                path: HomeRouting.SEARCH,
                loadChildren: () => import('./search-page/search-page.module')
                    .then(m => m.Tab3PageModule)
            },
            {
                path: '',
                redirectTo: `/home/${HomeRouting.MY_ORDERS}`,
                pathMatch: 'full'
            }
        ],
    },
    {
        path: '',
        redirectTo: `/home/${HomeRouting.MY_ORDERS}`,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {
}
