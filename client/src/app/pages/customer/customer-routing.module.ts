import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerPage } from './customer.page';

const routes: Routes = [
    {
        path: '',
        component: CustomerPage,
        children: [
            {
                path: 'tracking',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./tracking-page/tracking-page.module').then(m => m.TrackingPageModule)
                    }
                ]
            },
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./orders-page/orders-page.module').then(m => m.OrdersPageModule)
                    }
                ]
            },
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./search-page/search-page.module').then(m => m.Tab3PageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/customer/tracking',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/customer/tracking',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerPageRoutingModule {
}
