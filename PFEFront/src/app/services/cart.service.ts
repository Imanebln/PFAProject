import { Injectable } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private item$ = new BehaviorSubject<CartItem[]>([]);

  getCart() {
    return this.item$.asObservable();
  }
  addToCart(newItem: CartItem) {
    this.item$.next([...this.item$.getValue(), newItem]);
  }
  removeItem(id: number) {
    this.item$.next(this.item$.getValue().filter((item) => item.id != id));
  }
  getTotalAmount() {
    return this.item$.pipe(
      map((items) => {
        let total = 0;
        items.forEach((item) => {
          total += item.quantity * item.price;
        });

        return total;
      })
    );
  }
}
