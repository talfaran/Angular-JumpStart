import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { CanDeactivateGuard } from '../customer/guards/can-deactivate.guard';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  { path: 'new', component: NewOrderComponent , canDeactivate: [CanDeactivateGuard]}

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [CanDeactivateGuard]
})
export class OrdersRoutingModule {
  static components = [ OrdersComponent ];
}
