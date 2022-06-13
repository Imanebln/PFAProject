import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.module';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item: CartItem;

  constructor() {
    this.item = {
      id: 1,
      name: 'HTML CSS',
      price: 12,
      image: '../../assets/images/HtmlandCss.png',
      quantity: 1,
    };
  }
}
