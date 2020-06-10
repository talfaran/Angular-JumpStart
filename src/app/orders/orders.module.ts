import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { NewOrderComponent } from './new-order/new-order.component';

@NgModule({
  imports: [SharedModule, OrdersRoutingModule],
  declarations: [OrdersRoutingModule.components, NewOrderComponent]
})
export class OrdersModule { }
