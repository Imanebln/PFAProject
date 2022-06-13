import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../home/home.page';
import { MenuComponent } from './menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: 'listing',
        loadChildren: () =>
          import('../screens/listing/listing.module').then(
            (m) => m.ListingPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'listing',
        pathMatch: 'full',
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../screens/cart/cart.module').then((m) => m.CartPageModule),
      },
    ],
  },
  { path: 'home', component: HomePage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
