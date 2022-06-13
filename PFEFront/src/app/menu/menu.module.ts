import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MenuPageRoutingModule],
  declarations: [MenuComponent],
})
export class MenuPageModule {}
