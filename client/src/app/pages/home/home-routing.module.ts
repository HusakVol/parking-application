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
                path: HomeRouting.ORDER,
                loadChildren: () => import('./order/order.module')
                    .then(m => m.OrderPageModule)
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
                    .then(m => m.SearchPageModule)
            },
            {
                path: HomeRouting.ORDERS_QUEUE,
                loadChildren: () => import('./orders-queue/orders-queue.module').then(m => m.OrdersQueuePageModule)
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
