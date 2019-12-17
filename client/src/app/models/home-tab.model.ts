import { HomeRouting } from '../constants/home-routing.enum';

export const HomeTabs = {
    CUSTOMER: <HomeTab[]>[
        {tab: HomeRouting.MY_PROFILE, icon: 'person', title: 'Profile'},
        {tab: HomeRouting.MY_ORDERS, icon: 'basket', title: 'My orders'},
        {tab: HomeRouting.SEARCH, icon: 'search', title: 'Search'}
    ],
    DRIVER: <HomeTab[]>[
        {tab: HomeRouting.MY_PROFILE, icon: 'person', title: 'Profile'},
        {tab: HomeRouting.ORDERS_QUEUE, icon: 'bookmarks', title: 'Queue'},
        {tab: HomeRouting.SEARCH, icon: 'search', title: 'Search'}
    ]
};

export interface HomeTab {
    tab: string;
    icon: string;
    title: string;
}
