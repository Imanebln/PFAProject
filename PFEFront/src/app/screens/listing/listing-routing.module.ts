import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingPage } from './listing.page';

const routes: Routes = [
  {
    path: '',
    component: ListingPage,
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('../detail/detail.module').then((m) => m.DetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingPageRoutingModule {}
